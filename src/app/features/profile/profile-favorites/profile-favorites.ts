import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteWithAlbumResponse } from '../../../core/models/model/favoriteWithAlbumResponse';
import { AlbumGrid, AlbumGridItem } from '../../../shared/album-grid/album-grid';

@Component({
  selector: 'app-profile-favorites',
  standalone: true,
  imports: [RouterLink, AlbumGrid],
  templateUrl: './profile-favorites.html',
  styleUrl: './profile-favorites.scss',
})
export class ProfileFavorites {
  favorites = input.required<FavoriteWithAlbumResponse[]>();
  isMe = input(false);

  isEmpty = computed(() => this.favorites().length === 0);

  items = computed<AlbumGridItem[]>(() => {
    const filled = this.favorites().slice(0, 4).map((f) => ({
      albumId: f.album.id,
      cover: f.album.cover,
      title: f.album.title,
    }));
    const empties = Array(4 - filled.length).fill({ empty: true });
    return [...filled, ...empties];
  });
}
