import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Search, X } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AlbumService } from '../../../core/services/album.service';
import { AuthService } from '../../../core/services/auth.service';
import { Album } from '../../../core/models/model/album';
import { FavoriteService } from '../../../core/services/favorite.service';
import { FavoriteItemInput } from '../../../core/models/model/favoriteItemInput';

@Component({
  selector: 'app-edit-favorites',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './edit-favorites.html',
  styleUrl: './edit-favorites.scss',
})
export class EditFavorites {
  private albumService = inject(AlbumService);
  private favoriteService = inject(FavoriteService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly Search = Search;
  readonly X = X;

  selected = signal<(Album | null)[]>([null, null, null, null]);
  query = signal('');
  saving = signal(false);

  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q.trim().length < 2 ? of([]) : this.albumService.search(q))),
    ),
    { initialValue: [] as Album[] },
  );

  constructor() {
    const me = this.auth.currentUser();
    if (!me) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.favoriteService.getByUserId(me.id).subscribe((favs) => {
      const slots: (Album | null)[] = [null, null, null, null];
      for (const f of favs) {
        if (f.position >= 1 && f.position <= 4 && f.album) {
          slots[f.position - 1] = f.album;
        }
      }
      this.selected.set(slots);
    });
  }

  pick(album: Album): void {
    if (this.selected().some((s) => s?.id === album.id)) return;

    const slots = [...this.selected()];
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;
    slots[emptyIdx] = album;
    this.selected.set(slots);
  }

  remove(index: number): void {
    const slots = [...this.selected()];
    slots[index] = null;
    this.selected.set(slots);
  }

  save(): void {
    if (this.saving()) return;
    this.saving.set(true);

    const payload: FavoriteItemInput[] = this.selected()
      .map((album, i) => (album ? { album_id: String(album.id), position: i + 1 } : null))
      .filter((x): x is FavoriteItemInput => x !== null);

    this.favoriteService.replaceMine(payload).subscribe({
      next: () => {
        const me = this.auth.currentUser();
        if (me) {
          this.router.navigate(['/users', me.username]);
        }
      },
      error: () => this.saving.set(false),
    });
  }
}
