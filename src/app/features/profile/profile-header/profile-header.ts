import { Component, input, output } from '@angular/core';
import { UserProfileResponse } from '../../../core/models/model/userProfileResponse';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss',
})
export class ProfileHeader {
  user = input.required<UserProfileResponse>();
  isMe = input.required<boolean>();
  toggleFollow = output<void>();
}
