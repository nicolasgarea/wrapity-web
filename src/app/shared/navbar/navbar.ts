import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { House, LucideAngularModule, Search, CirclePlus, Heart, Activity } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { UserResponse } from '../../core/models/model/userResponse';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private userService = inject(UserService);

  readonly HouseIcon = House;
  readonly SearchIcon = Search;
  readonly PlusIcon = CirclePlus;
  readonly HeartIcon = Heart;
  readonly ActivityIcon = Activity;

  user = signal<UserResponse | null>(null);

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => this.user.set(user),
      error: () => this.user.set(null),
    });
  }

  getInitials(): string {
    const username = this.user()?.username;
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  }
}
