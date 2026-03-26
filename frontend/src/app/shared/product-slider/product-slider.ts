import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ProductCardComponent } from '../product-card/product-card';
import { Products } from '../../client';

@Component({
  selector: 'app-product-slider',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-slider.html',
  styleUrls: ['./product-slider.scss']
})
export class ProductSliderComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) items: Products[] = [];

  addToCart = output<Products>();

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
      modules: [Navigation],
      slidesPerView: 'auto',
      spaceBetween: 16,
      freeMode: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  prev(): void {
    this.swiper?.slidePrev();
  }

  next(): void {
    this.swiper?.slideNext();
  }
}