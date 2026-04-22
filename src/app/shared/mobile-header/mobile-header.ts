import { Component } from '@angular/core';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-mobile-header',
  imports: [Logo],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss',
})
export class MobileHeader {}
