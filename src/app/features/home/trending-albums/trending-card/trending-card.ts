import { Component, input } from '@angular/core';
import { Album } from '../../../../core/models/model/album';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trending-card',
  imports: [RouterLink],
  templateUrl: './trending-card.html',
  styleUrl: './trending-card.scss',
})
export class TrendingCard {
  album = input.required<Album>();
}
