import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrendingCard } from './trending-card/trending-card';
import { Carousel } from '../../../shared/carousel/carousel';
import { AlbumService } from '../../../core/services/album.service';

@Component({
  selector: 'app-trending-albums',
  imports: [TrendingCard, Carousel],
  templateUrl: './trending-albums.html',
  styleUrl: './trending-albums.scss',
})
export class TrendingAlbums {
  private albumService = inject(AlbumService);

  trendingAlbums = toSignal(this.albumService.getTrending());
}
