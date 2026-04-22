import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wrapity">
      <circle cx="20" cy="20" r="20" fill="#FCF300" />
      <circle cx="20" cy="20" r="3" fill="#0C0C0E" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }

      svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `,
  ],
})
export class Logo {}
