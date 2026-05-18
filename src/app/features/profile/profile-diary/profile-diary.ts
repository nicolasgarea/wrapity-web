import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';

interface DiaryEntry {
  day: number;
  review: ReviewFeedItemResponse;
}

interface DiaryMonth {
  label: string;
  entries: DiaryEntry[];
}

@Component({
  selector: 'app-profile-diary',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-diary.html',
  styleUrl: './profile-diary.scss',
})
export class ProfileDiary {
  userId = input.required<number>();

  private reviewService = inject(ReviewService);

  readonly PAGE_SIZE = 20;

  private reviews = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  hasMore = signal(false);
  private offset = 0;

  months = computed<DiaryMonth[]>(() => {
    const map = new Map<string, DiaryMonth>();
    for (const r of this.reviews()) {
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d
        .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        .toUpperCase();
      if (!map.has(key)) map.set(key, { label, entries: [] });
      map.get(key)!.entries.push({ day: d.getDate(), review: r });
    }
    return Array.from(map.values());
  });

  stars = (n: number) => Array.from({ length: 5 }, (_, i) => i < n);

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
