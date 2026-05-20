import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ActivityFeedItemResponse } from '../../../core/models/model/activityFeedItemResponse';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {
  item = input.required<ActivityFeedItemResponse>();

  albumClick = output<number>();
  userClick = output<string>();

  readonly Star = Star;

  readonly verb = computed(() => {
    switch (this.item().type) {
      case 'review':
        return 'reviewed';
      case 'like':
        return 'liked a review of';
      case 'follow':
        return 'started following';
      default:
        return '';
    }
  });

  formatDate(iso: string): string {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onActor() {
    this.userClick.emit(this.item().actor.username);
  }

  onTargetUser() {
    const target = this.item().target_user;
    if (target) this.userClick.emit(target.username);
  }

  onAlbum() {
    const review = this.item().review;
    if (review) this.albumClick.emit(review.album.id);
  }
}
