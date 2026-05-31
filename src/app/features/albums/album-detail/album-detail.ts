import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star, PenLine } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../../core/services/album.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { LikeButton } from '../../../shared/like-button/like-button';
import { formatRelativeDate } from '../../../core/utils/date';

@Component({
  selector: 'app-album-detail',
  imports: [LucideAngularModule, DecimalPipe, RouterLink, LikeButton],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss',
})
export class AlbumDetail implements OnDestroy {
  id = input.required<string>();

  private albumService = inject(AlbumService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private location = inject(Location);
  private router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly PenLine = PenLine;
  readonly stars = [1, 2, 3, 4, 5];
  readonly PAGE_SIZE = 10;
  readonly formatDate = formatRelativeDate;

  section = signal<'reviews' | 'tracklist' | 'details'>('reviews');

  album = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.albumService.getById(Number(id)))),
  );

  private reviewsList = signal<ReviewFeedItemResponse[]>([]);
  reviews = this.reviewsList.asReadonly();

  private myReviewSignal = signal<ReviewFeedItemResponse | null>(null);
  myReview = this.myReviewSignal.asReadonly();

  loadingMore = signal(false);
  hasMore = signal(true);
  private offset = 0;
  private inFlight = false;
  private observer?: IntersectionObserver;

  sentinel = viewChild<ElementRef<HTMLDivElement>>('sentinel');

  averageRating = computed(() => {
    const list = this.reviews();
    if (!list.length) return null;
    return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
  });

  reviewCount = computed(() => this.reviews().length);

  year = computed(() => this.album()?.release_date?.slice(0, 4) ?? null);
  genres = computed(() => this.album()?.genres ?? []);
  genreNames = computed(() =>
    this.genres()
      .map((g) => g.name)
      .join(', '),
  );
  tracks = computed(() => this.album()?.tracks ?? []);
  recordType = computed(() => this.album()?.record_type ?? null);
  nbTracks = computed(() => this.album()?.nb_tracks ?? this.tracks().length);
  runtime = computed(() => {
    const d = this.album()?.duration;
    return d ? this.formatRuntime(d) : null;
  });
  ratingHistogram = computed(() => {
    const list = this.reviews();
    const counts = [1, 2, 3, 4, 5].map(
      (rating) => list.filter((r) => Math.round(r.rating) === rating).length,
    );
    const max = Math.max(...counts, 1);

    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: counts[rating - 1],
      percentage: (counts[rating - 1] / max) * 100,
    }));
  });

  draftRating = signal(0);
  hoverRating = signal<number | null>(null);
  private content = '';
  isSubmitting = signal(false);

  constructor() {
    toObservable(this.id).subscribe((id) => {
      this.reviewsList.set([]);
      this.myReviewSignal.set(null);
      this.offset = 0;
      this.hasMore.set(true);
      this.inFlight = false;
      this.draftRating.set(0);
      this.content = '';

      this.loadPage(Number(id));
      this.loadMyReview(Number(id));
    });

    effect(() => {
      const el = this.sentinel()?.nativeElement;
      this.observer?.disconnect();
      this.observer = undefined;
      if (el) this.attachObserver(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private loadMyReview(albumId: number) {
    this.reviewService.getMyReviews().subscribe({
      next: (all) => {
        const found = all.find((r) => r.album.id === albumId) ?? null;
        this.myReviewSignal.set(found);
        if (found) {
          this.draftRating.set(found.rating);
          this.content = found.content ?? '';
        }
      },
      error: () => {},
    });
  }

  private attachObserver(el: HTMLElement) {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.loadPage(Number(this.id()));
      },
      { root: null, rootMargin: '0px 0px 100px 0px', threshold: 0 },
    );
    this.observer.observe(el);
  }

  private loadPage(albumId: number) {
    if (this.inFlight || !this.hasMore()) return;
    this.inFlight = true;
    this.loadingMore.set(true);

    this.reviewService.getByAlbum(albumId, this.PAGE_SIZE, this.offset).subscribe({
      next: (list) => {
        const newItems = list ?? [];
        this.reviewsList.update((curr) => [...curr, ...newItems]);
        this.offset += newItems.length;
        if (newItems.length < this.PAGE_SIZE) this.hasMore.set(false);
        this.loadingMore.set(false);
        this.inFlight = false;
      },
      error: () => {
        this.loadingMore.set(false);
        this.inFlight = false;
      },
    });
  }

  getStarFillPercent(i: number): number {
    const value = this.hoverRating() ?? this.draftRating();
    if (value >= i) return 100;
    if (value >= i - 0.5) return 50;
    return 0;
  }

  goToReview(reviewId: number) {
    this.router.navigate(['/reviews', reviewId]);
  }

  quickRate(value: number) {
    if (!this.auth.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.hoverRating.set(null);
    this.draftRating.set(value);
    this.persist();
  }

  onStarHover(value: number) {
    this.hoverRating.set(value);
  }

  onStarsLeave() {
    this.hoverRating.set(null);
  }

  private persist() {
    if (this.isSubmitting() || this.draftRating() === 0) return;
    this.isSubmitting.set(true);

    const mine = this.myReview();
    const payload = {
      rating: this.draftRating(),
      content: this.content.trim() || null,
    };

    const op$ = mine
      ? this.reviewService.update(mine.id, payload)
      : this.reviewService.create({ ...payload, album_id: Number(this.id()) });

    op$.subscribe({
      next: () => {
        this.reload();
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }

  private reload() {
    const albumId = Number(this.id());
    this.loadMyReview(albumId);
    this.reviewsList.set([]);
    this.offset = 0;
    this.hasMore.set(true);
    this.inFlight = false;
    this.loadPage(albumId);
  }

  formatRuntime(totalSeconds: number): string {
    const minutes = Math.round(totalSeconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return `${hours} h ${rem} min`;
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  goBack() {
    this.location.back();
  }
}
