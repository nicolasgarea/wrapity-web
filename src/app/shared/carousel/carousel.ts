import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  imports: [RouterLink],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  @Input() title?: string;
  @Input() seeAllLink?: string;
  @Input() loading = false;
  @Input() skeletonCount = 6;

  @ViewChild('viewport') viewport!: ElementRef<HTMLElement>;

  get skeletons(): number[] {
    return Array.from({ length: this.skeletonCount });
  }

  get parsedSeeAll(): { path: string; queryParams: Record<string, string> } | null {
    if (!this.seeAllLink) return null;
    const [path, query] = this.seeAllLink.split('?');
    const queryParams: Record<string, string> = {};
    if (query) {
      for (const pair of query.split('&')) {
        const [k, v] = pair.split('=');
        if (k) queryParams[k] = decodeURIComponent(v ?? '');
      }
    }
    return { path, queryParams };
  }

  scroll(direction: number): void {
    const container = this.viewport.nativeElement;
    const scrollAmount = container.clientWidth * 0.6;

    container.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth',
    });
  }
}
