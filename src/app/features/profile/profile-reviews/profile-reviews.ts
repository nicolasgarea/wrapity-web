import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';

@Component({
  selector: 'app-profile-reviews',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './profile-reviews.html',
  styleUrl: './profile-reviews.scss',
})
export class ProfileReviews {
  userId = input.required<number>();
  username = input.required<string>();

  private reviewService = inject(ReviewService);

  readonly Star = Star;

  reviews = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(false);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) return;
      this.loading.set(true);
      this.reviewService.getByUserId(id, 4, 0).subscribe({
        next: (list) => {
          this.reviews.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days < 1) return 'today';
    if (days < 7) return `${days}d`;
    if (days < 30) return `${Math.floor(days / 7)}w`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
