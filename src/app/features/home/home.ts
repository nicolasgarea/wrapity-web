import { Component } from '@angular/core';
import { TrendingAlbums } from './trending-albums/trending-albums';
import { FollowingReviews } from './following-reviews/following-reviews';

@Component({
  selector: 'app-home',
  imports: [TrendingAlbums, FollowingReviews],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
