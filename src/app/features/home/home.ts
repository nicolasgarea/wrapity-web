import { Component, inject } from '@angular/core';
import { TrendingAlbums } from './trending-albums/trending-albums';
import { FollowingFeed } from './following-feed/following-feed';
import { RecentReviews } from './recent-reviews/recent-reviews';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [TrendingAlbums, FollowingFeed, RecentReviews],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  user = inject(AuthService).currentUser;
}
