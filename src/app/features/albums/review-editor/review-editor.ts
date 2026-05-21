import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Star } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { AlbumService } from '../../../core/services/album.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { LikeButton } from '../../../shared/like-button/like-button';

@Component({
  selector: 'app-review-editor',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, LikeButton, DatePipe],
  templateUrl: './review-editor.html',
  styleUrl: './review-editor.scss',
})
export class ReviewEditor {
  id = input.required<string>();

  private albumService = inject(AlbumService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private location = inject(Location);
  private router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly Star = Star;
  readonly stars = [1, 2, 3, 4, 5];

  album = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.albumService.getById(Number(id)))),
  );

  draftRating = signal(0);
  hoverRating = signal<number | null>(null);
  draftContent = signal('');
  saving = signal(false);
  existingId = signal<number | null>(null);

  private albumReviews = signal<ReviewFeedItemResponse[]>([]);
  otherReviews = computed(() =>
    this.albumReviews().filter((r) => r.id !== this.existingId()),
  );

  selectedRating = computed(() => this.hoverRating() ?? this.draftRating());

  constructor() {
    if (!this.auth.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    toObservable(this.id).subscribe((idStr) => {
      const albumId = Number(idStr);
      this.reviewService.getMyReviews().subscribe((all) => {
        const found = all.find((r) => r.album.id === albumId);
        if (found) {
          this.existingId.set(found.id);
          this.draftRating.set(found.rating);
          this.draftContent.set(found.content ?? '');
        }
      });
      this.reviewService.getByAlbum(albumId, 12, 0).subscribe((list) => {
        this.albumReviews.set(list);
      });
    });
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

  save() {
    if (this.draftRating() === 0 || this.saving()) return;
    this.saving.set(true);

    const payload = {
      rating: this.draftRating(),
      content: this.draftContent().trim() || null,
    };
    const id = this.existingId();

    const op$ = id
      ? this.reviewService.update(id, payload)
      : this.reviewService.create({ ...payload, album_id: Number(this.id()) });

    op$.subscribe({
      next: () => this.router.navigate(['/albums', this.id()]),
      error: () => this.saving.set(false),
    });
  }

  remove() {
    const id = this.existingId();
    if (!id) return;
    if (!confirm('Delete your review?')) return;
    this.saving.set(true);
    this.reviewService.delete(id).subscribe({
      next: () => this.router.navigate(['/albums', this.id()]),
      error: () => this.saving.set(false),
    });
  }

  cancel() {
    this.location.back();
  }
}
