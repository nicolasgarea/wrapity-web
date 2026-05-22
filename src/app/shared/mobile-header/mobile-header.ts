import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mobile-header',
  imports: [Logo, RouterLink],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss',
})
export class MobileHeader {
  private authService = inject(AuthService);

  user = this.authService.currentUser;
}
