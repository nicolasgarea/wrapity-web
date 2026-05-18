import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface AlbumGridItem {
  albumId: number;
  cover?: string | null;
  title: string;
  rating?: number;
  empty?: boolean;
}

@Component({
  selector: 'app-album-grid',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './album-grid.html',
  styleUrl: './album-grid.scss',
})
export class AlbumGrid {
  items = input.required<AlbumGridItem[]>();
}
