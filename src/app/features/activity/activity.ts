import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { ActivityFeedItemResponse } from '../../core/models/model/activityFeedItemResponse';
import { ActivityCard } from './activity-card/activity-card';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [ActivityCard],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity {
  private activityService = inject(ActivityService);
  private router = inject(Router);

  readonly PAGE_SIZE = 20;

  items = signal<ActivityFeedItemResponse[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);

  private offset = 0;
  private inFlight = false;

  constructor() {
    this.loadPage(true);
  }

  private loadPage(initial = false) {
    if (this.inFlight || (!this.hasMore() && !initial)) return;

    this.inFlight = true;
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    this.activityService.getFollowingFeed(this.PAGE_SIZE, this.offset).subscribe({
      next: (res) => {
        const newItems = res.items ?? [];
        this.items.update((curr) => [...curr, ...newItems]);
        this.offset += newItems.length;
        if (newItems.length < this.PAGE_SIZE) this.hasMore.set(false);
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

  loadMore() {
    this.loadPage();
  }

  onReviewClick(reviewId: number) {
    this.router.navigate(['/reviews', reviewId]);
  }

  onUserClick(username: string) {
    this.router.navigate(['/users', username]);
  }
}
