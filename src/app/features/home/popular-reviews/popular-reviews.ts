import { Component, inject, signal } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { ReviewCarousel } from '../review-carousel/review-carousel';

@Component({
  selector: 'app-popular-reviews',
  imports: [ReviewCarousel],
  templateUrl: './popular-reviews.html',
  styleUrl: './popular-reviews.scss',
})
export class PopularReviews {
  private reviewService = inject(ReviewService);

  readonly PAGE_SIZE = 10;

  items = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(true);
  loadingMore = signal(false);

  private hasMore = true;
  private offset = 0;
  private inFlight = false;

  constructor() {
    this.loadPage(true);
  }

  private loadPage(initial = false) {
    if (this.inFlight || (!this.hasMore && !initial)) return;

    this.inFlight = true;
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    this.reviewService.getPopular(this.PAGE_SIZE, this.offset).subscribe({
      next: (items) => {
        this.items.update((curr) => [...curr, ...items]);
        this.offset += items.length;
        if (items.length < this.PAGE_SIZE) this.hasMore = false;
        this.loading.set(false);
        this.loadingMore.set(false);
        this.inFlight = false;
      },
      error: () => {
        this.loading.set(false);
        this.loadingMore.set(false);
        this.inFlight = false;
      },
    });
  }

  onNextPage() {
    this.loadPage();
  }
}
