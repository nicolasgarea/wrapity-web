import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Search as SearchIcon } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AlbumService } from '../../core/services/album.service';
import { ArtistService } from '../../core/services/artist.service';
import { UserService } from '../../core/services/user.service';
import { Album } from '../../core/models/model/album';
import { Artist } from '../../core/models/model/artist';
import { UserPublicResponse } from '../../core/models/model/userPublicResponse';
import { Logo } from '../../shared/logo/logo';

type Tab = 'albums' | 'artists' | 'users';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule, Logo],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private albumService = inject(AlbumService);
  private artistService = inject(ArtistService);
  private userService = inject(UserService);

  readonly SearchIcon = SearchIcon;

  reviewMode = input(false);

  query = signal('');
  tab = signal<Tab>('albums');

  private query$ = toObservable(this.query);

  albums = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q.trim().length < 2 ? of([]) : this.albumService.search(q))),
    ),
    { initialValue: [] as Album[] },
  );

  artists = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q.trim().length < 2 ? of([]) : this.artistService.search(q))),
    ),
    { initialValue: [] as Artist[] },
  );

  users = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q.trim().length < 2 ? of([]) : this.userService.search(q))),
    ),
    { initialValue: [] as UserPublicResponse[] },
  );

  empty = computed(() => {
    if (this.query().trim().length < 2) return false;
    switch (this.tab()) {
      case 'albums':
        return this.albums().length === 0;
      case 'artists':
        return this.artists().length === 0;
      default:
        return this.users().length === 0;
    }
  });

  setTab(t: Tab): void {
    this.tab.set(t);
  }

  albumLink(id: number): unknown[] {
    return this.reviewMode() ? ['/albums', id, 'review'] : ['/albums', id];
  }
}
