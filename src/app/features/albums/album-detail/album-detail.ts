import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Star } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../../core/services/album.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-album-detail',
  imports: [LucideAngularModule, DecimalPipe, FormsModule],
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.scss',
})
export class AlbumDetail {
  id = input.required<string>();

  private albumService = inject(AlbumService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private location = inject(Location);

  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly stars = [1, 2, 3, 4, 5];

  album = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.albumService.getById(Number(id)))),
  );

  private reviewsList = signal<any[]>([]);
  reviews = this.reviewsList.asReadonly();

  private currentUser = toSignal(this.auth.getMe());

  myReview = computed(() => {
    const uid = this.currentUser()?.id;
    if (!uid) return null;
    return this.reviews().find((r) => r.user?.id === uid) ?? null;
  });

  otherReviews = computed(() => {
    const uid = this.currentUser()?.id;
    if (!uid) return this.reviews();
    return this.reviews().filter((r) => r.user?.id !== uid);
  });

  averageRating = computed(() => {
    const list = this.reviews();
    if (!list.length) return null;
    return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
  });

  reviewCount = computed(() => this.reviews().length);
  favoriteCount = computed(() => this.album()?.favorite_count ?? 0);

  ratingDistribution = computed(() => {
    const list = this.reviews();
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of list) {
      const k = Math.round(r.rating);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    const total = list.length;
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = counts[rating] ?? 0;
      return {
        rating,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
  });

  isEditing = signal(false);
  draftRating = signal(0);
  hoverRating = signal<number | null>(null);
  draftContent = signal('');
  isSubmitting = signal(false);

  constructor() {
    toObservable(this.id)
      .pipe(switchMap((id) => this.reviewService.getByAlbum(Number(id))))
      .subscribe((list) => {
        this.reviewsList.set(list ?? []);
        const mine = this.myReview();
        if (mine) {
          this.draftRating.set(mine.rating);
          this.draftContent.set(mine.content ?? '');
        }
      });
  }

  getStarFillPercent(i: number): number {
    const value = this.hoverRating() ?? this.draftRating();
    if (value >= i) return 100;
    if (value >= i - 0.5) return 50;
    return 0;
  }

  onStarClick(value: number) {
    this.draftRating.set(value);
    this.hoverRating.set(null);
  }

  onStarHover(value: number) {
    this.hoverRating.set(value);
  }

  onStarsLeave() {
    this.hoverRating.set(null);
  }

  startEdit() {
    const mine = this.myReview();
    if (!mine) return;
    this.draftRating.set(mine.rating);
    this.draftContent.set(mine.content ?? '');
    this.isEditing.set(true);
  }

  cancelEdit() {
    const mine = this.myReview();
    if (mine) {
      this.draftRating.set(mine.rating);
      this.draftContent.set(mine.content ?? '');
    } else {
      this.draftRating.set(0);
      this.draftContent.set('');
    }
    this.isEditing.set(false);
  }

  submitReview() {
    if (this.draftRating() === 0 || this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const mine = this.myReview();
    const payload = {
      rating: this.draftRating(),
      content: this.draftContent().trim() || null,
    };

    const op$ = mine
      ? this.reviewService.update(mine.id, payload)
      : this.reviewService.create({ ...payload, album_id: Number(this.id()) });

    op$.subscribe({
      next: (saved) => {
        const list = this.reviews();
        const idx = list.findIndex((r) => r.id === saved.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = saved;
          this.reviewsList.set(next);
        } else {
          this.reviewsList.set([saved, ...list]);
        }
        this.isEditing.set(false);
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }

  deleteReview() {
    const mine = this.myReview();
    if (!mine) return;
    if (!confirm('Are you sure you want to delete your review?')) return;

    this.reviewService.delete(mine.id).subscribe(() => {
      this.reviewsList.set(this.reviews().filter((r) => r.id !== mine.id));
      this.draftRating.set(0);
      this.draftContent.set('');
      this.isEditing.set(false);
    });
  }

  goBack() {
    this.location.back();
  }
}
