import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { AlbumService } from '../../../core/services/album.service';
import { AlbumGrid, AlbumGridItem } from '../../../shared/album-grid/album-grid';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [AlbumGrid, LucideAngularModule],
  templateUrl: './trending.html',
  styleUrl: './trending.scss',
})
export class Trending {
  private albumService = inject(AlbumService);
  private location = inject(Location);
  private router = inject(Router);

  readonly ArrowLeft = ArrowLeft;

  items = toSignal(
    this.albumService.getTrending().pipe(
      map((albums): AlbumGridItem[] =>
        albums.map((a) => ({ albumId: a.id, cover: a.cover, title: a.title })),
      ),
    ),
    { initialValue: [] as AlbumGridItem[] },
  );

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
