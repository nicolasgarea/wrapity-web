import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { Carousel } from '../../../shared/carousel/carousel';
import { FollowingFeedCard } from './following-feed-card/following-feed-card';

@Component({
  selector: 'app-following-feed',
  imports: [CommonModule, LucideAngularModule, Carousel, FollowingFeedCard],
  templateUrl: './following-feed.html',
  styleUrl: './following-feed.scss',
})
export class FollowingFeed implements OnDestroy {
  private reviewService = inject(ReviewService);
  private router = inject(Router);

  readonly Star = Star;
  readonly PAGE_SIZE = 10;

  items = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);

  private offset = 0;
  private inFlight = false;
  private observer?: IntersectionObserver;

  isEmpty = computed(() => !this.loading() && this.items().length === 0);

  sentinel = viewChild<ElementRef<HTMLDivElement>>('sentinel');

  constructor() {
    this.loadPage(true);

    effect(() => {
      const el = this.sentinel()?.nativeElement;
      if (el && !this.observer) this.attachObserver(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private attachObserver(el: HTMLElement) {
    const root = this.findScrollableAncestor(el);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.loadPage();
      },
      {
        root,
        rootMargin: '0px 400px 0px 0px',
        threshold: 0,
      },
    );
    this.observer.observe(el);
  }

  private findScrollableAncestor(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = el.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  private loadPage(initial = false) {
    if (this.inFlight) return;
    if (!this.hasMore() && !initial) return;

    this.inFlight = true;
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    this.reviewService.getFollowingFeed(this.PAGE_SIZE, this.offset).subscribe({
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

  goToAlbum(albumId: number) {
    this.router.navigate(['/albums', albumId]);
  }

  goToUser(userId: number) {
    this.router.navigate(['/users', userId]);
  }

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
