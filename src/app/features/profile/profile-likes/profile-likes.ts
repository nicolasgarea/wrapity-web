import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { ReviewCard } from '../../home/review-carousel/review-card/review-card';

@Component({
  selector: 'app-profile-likes',
  standalone: true,
  imports: [ReviewCard],
  templateUrl: './profile-likes.html',
  styleUrl: './profile-likes.scss',
})
export class ProfileLikes {
  userId = input.required<number>();

  private reviewService = inject(ReviewService);
  private router = inject(Router);

  readonly PAGE_SIZE = 12;

  items = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  hasMore = signal(false);

  private offset = 0;

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) return;
      this.offset = 0;
      this.items.set([]);
      this.hasMore.set(false);
      this.loadPage(true);
    });
  }

  private loadPage(initial: boolean) {
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    this.reviewService.getLikedBy(this.userId(), this.PAGE_SIZE, this.offset).subscribe({
      next: (list) => {
        this.items.update((curr) => [...curr, ...list]);
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

  goToReview(reviewId: number) {
    this.router.navigate(['/reviews', reviewId]);
  }

  goToUser(username: string) {
    this.router.navigate(['/users', username]);
  }
}
