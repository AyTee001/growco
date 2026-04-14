import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MatIconModule } from '@angular/material/icon';

export interface BannerCardClick {
  id: string;
  title: string;
}

@Component({
  selector: 'app-banner-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './banner-section.html',
  styleUrls: ['./banner-section.scss']
})
export class BannerSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) leftImages: string[] = [];

  cardClick = output<BannerCardClick>();

  private readonly staticCardsData = [
    { 
      id: 'discounts', 
      title: 'Всі акції', 
      imageUrl: 'images/discount.png'
    },
    { 
      id: 'about', 
      title: 'Про нас', 
      imageUrl: 'images/logo-no-bg.png'
    },
    { 
      id: 'week-products', 
      title: 'Товари тижня', 
      imageUrl: 'images/product-of-the-week.png'
    }
  ];

  get rightCards() {
    return this.staticCardsData;
  }

  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef<HTMLDivElement>;

  private swiper: Swiper | null = null;

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  private initSwiper(): void {
    this.swiper = new Swiper(this.swiperContainerRef.nativeElement, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.banner-swiper-button-next',
        prevEl: '.banner-swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }

  onCardClick(card: { id: string; title: string }): void {
    this.cardClick.emit({ id: card.id, title: card.title });
  }
}