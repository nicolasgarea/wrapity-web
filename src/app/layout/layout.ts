import { Component } from '@angular/core';
import { Navbar } from '../shared/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { MobileHeader } from '../shared/mobile-header/mobile-header';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet, MobileHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
