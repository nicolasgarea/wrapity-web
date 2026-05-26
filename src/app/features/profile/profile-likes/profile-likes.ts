import { Component, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';

@Component({
  selector: 'app-profile-likes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-likes.html',
  styleUrl: './profile-likes.scss',
})
export class ProfileLikes {
  userId = input.required<number>();

  private reviewService = inject(ReviewService);
  private router = inject(Router);

  readonly PAGE_SIZE = 18;

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

  authorInitial(username: string): string {
    return username.charAt(0).toUpperCase();
  }

  goToAuthor(event: Event, username: string) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/users', username]);
  }
}
