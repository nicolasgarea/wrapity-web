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

  favoriteCount = computed(() => this.album()?.favorite_count ?? 0);

  ratingDistribution = computed(() => {
    const list = this.reviews();
    console.log('REVIEWS:', list);
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of list) counts[r.rating] = (counts[r.rating] ?? 0) + 1;
    const total = list.length;
    const result = [5, 4, 3, 2, 1].map((rating) => {
      const count = counts[rating] ?? 0;
      return {
        rating,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
    return result;
  });

  goBack() {
    this.location.back();
  }

  writeReview() {
    console.log('TODO: open review form');
  }
}
