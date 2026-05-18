import { Component, inject } from '@angular/core';
import { TrendingAlbums } from './trending-albums/trending-albums';
import { FollowingFeed } from './following-feed/following-feed';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [TrendingAlbums, FollowingFeed],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  user = inject(AuthService).currentUser;
}
