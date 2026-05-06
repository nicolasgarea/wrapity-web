import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, forkJoin, of, catchError } from 'rxjs';
import { signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileResponse } from '../../core/models/model/userProfileResponse';
import { FavoriteResponse } from '../../core/models/model/favoriteResponse';
import { ProfileHeader } from './profile-header/profile-header';
import { ProfileFavorites } from './profile-favorites/profile-favorites';
import { ProfileReviews } from './profile-reviews/profile-reviews';

@Component({
  selector: 'app-profile',
  imports: [ProfileHeader, ProfileFavorites, ProfileReviews],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private favoriteService = inject(FavoriteService);
  private auth = inject(AuthService);

  username = toSignal(this.route.paramMap.pipe(map((p) => p.get('username') ?? '')), {
    initialValue: '',
  });

  private data = toSignal(
    toObservable(this.username).pipe(
      switchMap((username) => {
        if (!username) return of(null);
        return this.userService.getByUsername(username).pipe(
          switchMap((user) =>
            this.favoriteService
              .getByUserId(user.id)
              .pipe(map((favorites) => ({ user, favorites }))),
          ),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null },
  );

  private userOverride = signal<UserProfileResponse | null>(null);

  user = computed<UserProfileResponse | null>(
    () => this.userOverride() ?? this.data()?.user ?? null,
  );
  favorites = computed<FavoriteResponse[]>(() => this.data()?.favorites ?? []);
  loading = computed(() => this.username() !== '' && this.data() === null);

  isMe = computed(() => {
    const me = this.auth.currentUser();
    const u = this.user();
    return !!me && !!u && me.username === u.username;
  });

  onToggleFollow(): void {
    const u = this.user();
    if (!u || u.is_following === null) return;

    const wasFollowing = u.is_following;
    this.userOverride.set({
      ...u,
      is_following: !wasFollowing,
      followers_count: u.followers_count + (wasFollowing ? -1 : 1),
    });

    const req$ = wasFollowing ? this.userService.unfollow(u.id) : this.userService.follow(u.id);

    req$.subscribe({
      error: () => this.userOverride.set(u),
    });
  }
}
