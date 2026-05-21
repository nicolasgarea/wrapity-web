import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, of, catchError } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileResponse } from '../../core/models/model/userProfileResponse';
import { FavoriteWithAlbumResponse } from '../../core/models/model/favoriteWithAlbumResponse';
import { ProfileHeader } from './profile-header/profile-header';
import { ProfileFavorites } from './profile-favorites/profile-favorites';
import { ProfileReviews } from './profile-reviews/profile-reviews';
import { ProfileDiary } from './profile-diary/profile-diary';

type Section = 'reviews' | 'diary';

@Component({
  selector: 'app-profile',
  imports: [ProfileHeader, ProfileFavorites, ProfileReviews, ProfileDiary],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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

  user = linkedSignal<UserProfileResponse | null>(() => this.data()?.user ?? null);
  favorites = computed<FavoriteWithAlbumResponse[]>(() => this.data()?.favorites ?? []);
  loading = computed(() => this.username() !== '' && this.data() === null);

  isMe = computed(() => {
    const me = this.auth.currentUser();
    const u = this.user();
    return !!me && !!u && me.username === u.username;
  });

  section = signal<Section>('reviews');

  onToggleFollow(): void {
    if (!this.auth.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const u = this.user();
    if (!u || u.is_following === null) return;

    const wasFollowing = u.is_following;
    this.user.set({
      ...u,
      is_following: !wasFollowing,
      followers_count: u.followers_count + (wasFollowing ? -1 : 1),
    });

    const req$ = wasFollowing ? this.userService.unfollow(u.id) : this.userService.follow(u.id);
    req$.subscribe({ error: () => this.user.set(u) });
  }
}
