import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { LucideAngularModule, ArrowLeft, Star, PenLine } from 'lucide-angular';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { LikeButton } from '../../../shared/like-button/like-button';
import { formatRelativeDate } from '../../../core/utils/date';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, LikeButton],
  templateUrl: './review-detail.html',
  styleUrl: './review-detail.scss',
})
export class ReviewDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);

  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly PenLine = PenLine;
  readonly formatDate = formatRelativeDate;

  loading = signal(true);
  notFound = signal(false);
  others = signal<ReviewFeedItemResponse[]>([]);

  private data = toSignal(
    this.route.paramMap.pipe(
      map((p) => Number(p.get('id'))),
      switchMap((id) => {
        if (!id) {
          this.notFound.set(true);
          this.loading.set(false);
          return of(null);
        }
        this.loading.set(true);
        this.notFound.set(false);
        this.others.set([]);
        return this.reviewService.getById(id).pipe(
          map((review) => {
            this.loading.set(false);
            return review;
          }),
          catchError(() => {
            this.loading.set(false);
            this.notFound.set(true);
            return of(null);
          }),
        );
      }),
    ),
    { initialValue: null },
  );

  review = computed<ReviewFeedItemResponse | null>(() => this.data());

  isMine = computed(() => {
    const me = this.auth.currentUser();
    const r = this.review();
    return !!me && !!r && me.id === r.author.id;
  });

  stars = [1, 2, 3, 4, 5];

  constructor() {
    effect(() => {
      const r = this.review();
      if (!r) return;
      this.reviewService.getByAlbum(r.album.id, 8, 0).subscribe({
        next: (list) => this.others.set(list.filter((x) => x.id !== r.id)),
        error: () => this.others.set([]),
      });
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }

  goToReview(reviewId: number) {
    this.router.navigate(['/reviews', reviewId]);
  }
}
