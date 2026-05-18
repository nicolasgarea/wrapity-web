import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { House, LucideAngularModule, Search, CirclePlus, Activity, User } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private el = inject(ElementRef);

  readonly HouseIcon = House;
  readonly SearchIcon = Search;
  readonly PlusIcon = CirclePlus;
  readonly ActivityIcon = Activity;
  readonly UserIcon = User;

  user = this.authService.currentUser;
  menuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  getInitials(): string {
    const username = this.user()?.username;
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  }

  logout(): void {
    this.menuOpen.set(false);
    this.authService.logout();
  }
}
