import { Component, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Heart, LucideAngularModule } from 'lucide-angular';
import { LikeService } from '../../core/services/like.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-like-button',
  imports: [LucideAngularModule],
  templateUrl: './like-button.html',
  styleUrl: './like-button.scss',
})
export class LikeButton {
  private likeService = inject(LikeService);
  private auth = inject(AuthService);
  private router = inject(Router);

  reviewId = input.required<number>();
  initialLiked = input<boolean>(false);
  initialCount = input<number>(0);

  readonly Heart = Heart;

  liked = linkedSignal(() => this.initialLiked());
  count = linkedSignal(() => this.initialCount());

  private pending = false;

  toggle(event: Event) {
    event.stopPropagation();

    if (!this.auth.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.pending) return;

    const id = this.reviewId();
    const wasLiked = this.liked();

    this.liked.set(!wasLiked);
    this.count.update((c) => c + (wasLiked ? -1 : 1));
    this.pending = true;

    const request: Observable<unknown> = wasLiked
      ? this.likeService.unlike(id)
      : this.likeService.like(id);
    request.subscribe({
      next: () => {
        this.pending = false;
      },
      error: () => {
        this.liked.set(wasLiked);
        this.count.update((c) => c + (wasLiked ? 1 : -1));
        this.pending = false;
      },
    });
  }
}
