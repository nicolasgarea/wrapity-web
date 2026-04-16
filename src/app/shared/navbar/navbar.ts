import { Component } from '@angular/core';
import { House, LucideAngularModule, Search, CirclePlus, Heart, User } from 'lucide-angular';
@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly HouseIcon = House;
  readonly SearchIcon = Search;
  readonly PlusIcon = CirclePlus;
  readonly InfoIcon = Heart;
  readonly PersonIcon = User;
}
