import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrendingAlbumsService } from './trending-albums.service';
import { TrendingCard } from './trending-card/trending-card';
import { Carousel } from '../../../shared/carousel/carousel';

@Component({
  selector: 'app-trending-albums',
  imports: [TrendingCard, Carousel],
  templateUrl: './trending-albums.html',
  styleUrl: './trending-albums.scss',
})
export class TrendingAlbums {
  private trendingAlbumsService = inject(TrendingAlbumsService);

  trendingAlbums = toSignal(this.trendingAlbumsService.getTrendingAlbums());
}
