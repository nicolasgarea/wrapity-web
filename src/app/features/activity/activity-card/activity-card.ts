import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ActivityFeedItemResponse } from '../../../core/models/model/activityFeedItemResponse';
import { formatRelativeDate } from '../../../core/utils/date';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {
  item = input.required<ActivityFeedItemResponse>();

  reviewClick = output<number>();
  userClick = output<string>();

  readonly Star = Star;

  readonly verb = computed(() => {
    switch (this.item().type) {
      case 'review':
        return 'reviewed';
      case 'like':
        return 'liked';
      case 'follow':
        return 'started following';
      default:
        return '';
    }
  });

  readonly formatDate = formatRelativeDate;

  onActor() {
    this.userClick.emit(this.item().actor.username);
  }

  onTargetUser() {
    const target = this.item().target_user;
    if (target) this.userClick.emit(target.username);
  }

  onReviewAuthor() {
    const review = this.item().review;
    if (review) this.userClick.emit(review.author.username);
  }

  onReview() {
    const review = this.item().review;
    if (review) this.reviewClick.emit(review.id);
  }
}
