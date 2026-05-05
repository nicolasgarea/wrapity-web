import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { House, LucideAngularModule, Search, CirclePlus, Activity } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserResponse } from '../../core/models/model/userResponse';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private el = inject(ElementRef);

  readonly HouseIcon = House;
  readonly SearchIcon = Search;
  readonly PlusIcon = CirclePlus;
  readonly ActivityIcon = Activity;

  user = signal<UserResponse | null>(null);
  menuOpen = signal(false);

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => this.user.set(user),
      error: () => this.user.set(null),
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
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
