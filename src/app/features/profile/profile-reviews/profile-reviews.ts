import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { AlbumGrid, AlbumGridItem } from '../../../shared/album-grid/album-grid';

@Component({
  selector: 'app-profile-reviews',
  standalone: true,
  imports: [AlbumGrid],
  templateUrl: './profile-reviews.html',
  styleUrl: './profile-reviews.scss',
})
export class ProfileReviews {
  userId = input.required<number>();

  private reviewService = inject(ReviewService);

  readonly PAGE_SIZE = 12;

  private reviews = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  hasMore = signal(false);

  private offset = 0;

  items = computed<AlbumGridItem[]>(() =>
    this.reviews().map((r) => ({
      albumId: r.album.id,
      reviewId: r.id,
      cover: r.album.cover,
      title: r.album.title,
      rating: r.rating,
    })),
  );

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) return;
      this.offset = 0;
      this.reviews.set([]);
      this.hasMore.set(false);
      this.loadPage(true);
    });
  }

  private loadPage(initial: boolean) {
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    this.reviewService.getByUserId(this.userId(), this.PAGE_SIZE, this.offset).subscribe({
      next: (list) => {
        this.reviews.update((curr) => [...curr, ...list]);
        this.offset += list.length;
        this.hasMore.set(list.length === this.PAGE_SIZE);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }

  loadMore() {
    this.loadPage(false);
  }
}
