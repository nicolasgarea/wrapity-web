import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, Location } from '@angular/common';
import { LucideAngularModule, ArrowLeft, Heart, Pencil, Star } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../../core/services/album.service';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-album-detail',
  imports: [LucideAngularModule, DecimalPipe],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss',
})
export class AlbumDetail {
  id = input.required<string>();

  private albumService = inject(AlbumService);
  private reviewService = inject(ReviewService);
  private location = inject(Location);

  readonly ArrowLeft = ArrowLeft;
  readonly Heart = Heart;
  readonly Pencil = Pencil;
  readonly Star = Star;

  album = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.albumService.getById(Number(id)))),
  );

  reviews = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.reviewService.getByAlbum(Number(id)))),
    { initialValue: [] },
  );

  averageRating = computed(() => {
    const list = this.reviews();
    if (!list.length) return null;
    return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
  });

  reviewCount = computed(() => this.reviews().length);

  favoriteCount = computed(() => 0); // TODO

  goBack() {
    this.location.back();
  }

  writeReview() {
    console.log('TODO: open review form');
  }

  toggleFavorite() {
    console.log('TODO: favorite logic');
  }
}
