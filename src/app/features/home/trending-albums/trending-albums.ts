import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TrendingAlbumsService } from './trending-albums.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrendingCard } from './trending-card/trending-card';
@Component({
  selector: 'app-trending-albums',
  imports: [TrendingCard],
  templateUrl: './trending-albums.html',
  styleUrl: './trending-albums.scss',
})
export class TrendingAlbums {
  private trendingAlbumsService = inject(TrendingAlbumsService);

  trendingAlbums = toSignal(this.trendingAlbumsService.getTrendingAlbums());

  @ViewChild('carousel') carousel!: ElementRef;

  scroll(direction: number): void {
    const container = this.carousel.nativeElement;
    const scrollAmount = container.clientWidth * 0.6;

    container.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth',
    });
  }
}
