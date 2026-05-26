import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { ReviewCard } from '../../home/review-carousel/review-card/review-card';
import { AuthService } from '../../../core/services/auth.service';

type Filter = 'popular' | 'recent' | 'following';

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [ReviewCard, LucideAngularModule],
  templateUrl: './reviews-list.html',
  styleUrl: './reviews-list.scss',
})
export class ReviewsList implements OnDestroy {
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private location = inject(Location);

  readonly ArrowLeft = ArrowLeft;

  readonly PAGE_SIZE = 24;

  filter = toSignal(
    this.route.queryParamMap.pipe(
      map((qp): Filter => {
        const f = qp.get('filter');
        return f === 'recent' || f === 'following' ? f : 'popular';
      }),
    ),
    { initialValue: 'popular' as Filter },
  );

  items = signal<ReviewFeedItemResponse[]>([]);
  loading = signal(true);
  loadingMore = signal(false);

  title = computed(() => {
    switch (this.filter()) {
      case 'recent':
        return 'Recent reviews';
      case 'following':
        return 'New from friends';
      default:
        return 'Popular this week';
    }
  });

  hint = computed(() => {
    switch (this.filter()) {
      case 'recent':
        return 'The latest reviews from the community';
      case 'following':
        return 'Reviews from the people you follow';
      default:
        return 'Most-liked reviews of the last 7 days';
    }
  });

  private hasMore = true;
  private offset = 0;
  private inFlight = false;
  private sentinel = viewChild<ElementRef<HTMLDivElement>>('sentinel');
  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const f = this.filter();
      if (f === 'following' && !this.auth.currentUser()) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.resetAndLoad();
    });

    effect(() => {
      const el = this.sentinel()?.nativeElement;
      if (el && !this.observer) this.attachObserver(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private resetAndLoad() {
    this.items.set([]);
    this.offset = 0;
    this.hasMore = true;
    this.loadPage(true);
  }

  private loadPage(initial = false) {
    if (this.inFlight || (!this.hasMore && !initial)) return;

    this.inFlight = true;
    if (initial) this.loading.set(true);
    else this.loadingMore.set(true);

    const f = this.filter();
    const obs =
      f === 'recent'
        ? this.reviewService.getRecent(this.PAGE_SIZE, this.offset)
        : f === 'following'
          ? this.reviewService.getFollowingFeed(this.PAGE_SIZE, this.offset).pipe(
              map((res) => res.items ?? []),
            )
          : this.reviewService.getPopular(this.PAGE_SIZE, this.offset);

    obs.subscribe({
      next: (newItems) => {
        this.items.update((curr) => [...curr, ...newItems]);
        this.offset += newItems.length;
        if (newItems.length < this.PAGE_SIZE) this.hasMore = false;
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

  private attachObserver(el: HTMLElement) {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.loadPage();
      },
      { rootMargin: '400px 0px 0px 0px', threshold: 0 },
    );
    this.observer.observe(el);
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToAlbum(albumId: number) {
    this.router.navigate(['/albums', albumId]);
  }

  goToUser(username: string) {
    this.router.navigate(['/users', username]);
  }
}
