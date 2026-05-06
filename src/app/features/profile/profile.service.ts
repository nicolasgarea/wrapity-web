import { inject, Injectable, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { UserProfileResponse } from '../../core/models/model/userProfileResponse';
import { FavoriteResponse } from '../../core/models/model/favoriteResponse';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private userService = inject(UserService);
  private favoriteService = inject(FavoriteService);

  user = signal<UserProfileResponse | null>(null);
  favorites = signal<FavoriteResponse[]>([]);
  loading = signal(false);

  load(username: string): void {
    this.loading.set(true);
    this.user.set(null);
    this.favorites.set([]);

    this.userService
      .getByUsername(username)
      .pipe(
        tap((user) => this.user.set(user)),
        switchMap((user) => this.favoriteService.getByUserId(user.id)),
      )
      .subscribe({
        next: (favorites) => {
          this.favorites.set(favorites);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  toggleFollow(): void {
    const user = this.user();
    if (!user || user.is_following === null) return;

    const wasFollowing = user.is_following;
    this.user.set({
      ...user,
      is_following: !wasFollowing,
      followers_count: user.followers_count + (wasFollowing ? -1 : 1),
    });

    const request$ = wasFollowing
      ? this.userService.unfollow(user.id)
      : this.userService.follow(user.id);

    request$.subscribe();
  }
}
