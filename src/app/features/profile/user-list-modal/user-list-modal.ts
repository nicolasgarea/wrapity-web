import { Component, HostListener, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPublicResponse } from '../../../core/models/model/userPublicResponse';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-list-modal.html',
  styleUrl: './user-list-modal.scss',
})
export class UserListModal {
  title = input.required<string>();
  users = input.required<UserPublicResponse[]>();
  loading = input.required<boolean>();
  close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close.emit();
  }
}
