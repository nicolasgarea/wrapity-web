import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FollowingReviewsService } from './following-reviews.service';
import { ReviewCard } from './review-card/review-card';
import { Carousel } from '../../../shared/carousel/carousel';

@Component({
  selector: 'app-following-reviews',
  imports: [ReviewCard, Carousel],
  templateUrl: './following-reviews.html',
  styleUrl: './following-reviews.scss',
})
export class FollowingReviews {
  readonly followingService = inject(FollowingReviewsService);

  followingReviews = toSignal(this.followingService.getFollowingReviews());

  ngOnInit() {
    console.log(this.followingReviews);
  }
}
