import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, output } from '@angular/core';
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
export class ProductSliderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) items: Products[] = [];

  addToCart = output<Products>();

  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef<HTMLDivElement>;

  public swiper: Swiper | null = null;
  private isViewReady = false;

  // Navigation states
  public isBeginning = true;
  public isEnd = false;

  ngAfterViewInit(): void {
    this.isViewReady = true;
    if (this.items && this.items.length > 0) {
      setTimeout(() => this.initSwiper(), 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.isViewReady) {
      setTimeout(() => {
        if (this.swiper) {
          this.swiper.destroy(true, true);
          this.swiper = null;
        }
        if (this.items && this.items.length > 0) {
          this.initSwiper();
        }
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  private initSwiper(): void {
    if (!this.swiperContainerRef) return;
    this.swiper = new Swiper(this.swiperContainerRef.nativeElement, {
      modules: [Navigation],
      slidesPerView: 'auto',
      spaceBetween: 16,
      freeMode: {
        enabled: true,
        momentum: true,
        sticky: false
      },
      watchOverflow: true,
      on: {
        init: (s) => this.updateNavState(s),
        slideChange: (s) => this.updateNavState(s),
        transitionEnd: (s) => this.updateNavState(s),
        progress: (s) => this.updateNavState(s),
      }
    });
  }

  private updateNavState(s: Swiper): void {
    this.isBeginning = s.isBeginning;
    this.isEnd = s.isEnd;
  }

  prev(): void {
    this.swiper?.slidePrev();
  }

  next(): void {
    this.swiper?.slideNext();
  }
}