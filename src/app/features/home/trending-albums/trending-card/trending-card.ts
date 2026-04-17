import { Component, input } from '@angular/core';
import { Album } from '../../../../core/models/model/album';

@Component({
  selector: 'app-trending-card',
  imports: [],
  templateUrl: './trending-card.html',
  styleUrl: './trending-card.scss',
})
export class TrendingCard {
  album = input.required<Album>();
}
