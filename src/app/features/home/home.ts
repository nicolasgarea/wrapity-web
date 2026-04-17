import { Component } from '@angular/core';
import { TrendingAlbums } from './trending-albums/trending-albums';

@Component({
  selector: 'app-home',
  imports: [TrendingAlbums],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
