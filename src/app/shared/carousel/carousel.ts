import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  @Input() title?: string;

  @ViewChild('viewport') viewport!: ElementRef<HTMLElement>;

  scroll(direction: number): void {
    const container = this.viewport.nativeElement;
    const scrollAmount = container.clientWidth * 0.6;

    container.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth',
    });
  }
}
