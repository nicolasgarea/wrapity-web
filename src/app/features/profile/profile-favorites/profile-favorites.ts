import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteResponse } from '../../../core/models/model/favoriteResponse';

@Component({
  selector: 'app-profile-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-favorites.html',
  styleUrl: './profile-favorites.scss',
})
export class ProfileFavorites {
  favorites = input.required<FavoriteResponse[]>();

  slots = computed(() => {
    const items = this.favorites().slice(0, 4);
    return [...items, ...Array(4 - items.length).fill(null)];
  });
}
