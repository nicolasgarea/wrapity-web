import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { ReviewFeedItemResponse } from '../../../../core/models/model/reviewFeedItemResponse';
import { LikeButton } from '../../../../shared/like-button/like-button';
import { formatRelativeDate } from '../../../../core/utils/date';

@Component({
  selector: 'app-review-card',
  imports: [LucideAngularModule, LikeButton],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {
  item = input.required<ReviewFeedItemResponse>();
  albumClick = output<number>();
  userClick = output<string>();

  readonly Star = Star;
  readonly stars = [1, 2, 3, 4, 5];
  readonly formatDate = formatRelativeDate;

  onAlbum(event: Event) {
    event.stopPropagation();
    this.albumClick.emit(this.item().album.id);
  }

  onUser(event: Event) {
    event.stopPropagation();
    this.userClick.emit(this.item().author.username);
  }
}
