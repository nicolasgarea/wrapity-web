import { Component, inject } from '@angular/core';
import { TrendingAlbums } from './trending-albums/trending-albums';
import { FollowingFeed } from './following-feed/following-feed';
import { PopularReviews } from './popular-reviews/popular-reviews';
import { RecentReviews } from './recent-reviews/recent-reviews';
import { HomeHero } from './home-hero/home-hero';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [HomeHero, TrendingAlbums, FollowingFeed, PopularReviews, RecentReviews],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  user = inject(AuthService).currentUser;
}
