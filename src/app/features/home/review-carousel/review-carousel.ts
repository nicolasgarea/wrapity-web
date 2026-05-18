import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReviewFeedItemResponse } from '../../../core/models/model/reviewFeedItemResponse';
import { Carousel } from '../../../shared/carousel/carousel';
import { ReviewCard } from './review-card/review-card';

@Component({
  selector: 'app-review-carousel',
  imports: [Carousel, ReviewCard],
  templateUrl: './review-carousel.html',
  styleUrl: './review-carousel.scss',
})
export class ReviewCarousel implements OnDestroy {
  private router = inject(Router);

  title = input.required<string>();
  items = input.required<ReviewFeedItemResponse[]>();
  loading = input.required<boolean>();
  loadingMore = input.required<boolean>();
  emptyTitle = input<string>('');
  emptyHint = input<string>('');

  nextPage = output<void>();

  private sentinel = viewChild<ElementRef<HTMLDivElement>>('sentinel');
  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const el = this.sentinel()?.nativeElement;
      if (el && !this.observer) this.attachObserver(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private attachObserver(el: HTMLElement) {
    const root = this.findScrollableAncestor(el);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.nextPage.emit();
      },
      { root, rootMargin: '0px 400px 0px 0px', threshold: 0 },
    );
    this.observer.observe(el);
  }

  private findScrollableAncestor(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = el.parentElement;
    while (parent) {
      const { overflowX } = getComputedStyle(parent);
      if (overflowX === 'auto' || overflowX === 'scroll') return parent;
      parent = parent.parentElement;
    }
    return null;
  }

  goToAlbum(albumId: number) {
    this.router.navigate(['/albums', albumId]);
  }

  goToUser(username: string) {
    this.router.navigate(['/users', username]);
  }
}
