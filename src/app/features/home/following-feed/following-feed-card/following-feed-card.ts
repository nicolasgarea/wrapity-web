import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ReviewFeedItemResponse } from '../../../../core/models/model/reviewFeedItemResponse';

@Component({
  selector: 'app-following-feed-card',
  imports: [LucideAngularModule],
  templateUrl: './following-feed-card.html',
  styleUrl: './following-feed-card.scss',
})
export class FollowingFeedCard {
  item = input.required<ReviewFeedItemResponse>();

  albumClick = output<number>();
  userClick = output<string>();

  readonly Star = Star;

  formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onAlbum(event: Event) {
    event.stopPropagation();
    this.albumClick.emit(this.item().album.id);
  }

  onUser(event: Event) {
    event.stopPropagation();
    this.userClick.emit(this.item().author.username);
  }
}
