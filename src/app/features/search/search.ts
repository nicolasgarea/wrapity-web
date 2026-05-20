import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Search as SearchIcon } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AlbumService } from '../../core/services/album.service';
import { UserService } from '../../core/services/user.service';
import { Album } from '../../core/models/model/album';
import { UserPublicResponse } from '../../core/models/model/userPublicResponse';

type Tab = 'albums' | 'users';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private albumService = inject(AlbumService);
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
    return this.tab() === 'albums' ? this.albums().length === 0 : this.users().length === 0;
  });

  setTab(t: Tab): void {
    this.tab.set(t);
  }

  albumLink(id: number): unknown[] {
    return this.reviewMode() ? ['/albums', id, 'review'] : ['/albums', id];
  }
}
