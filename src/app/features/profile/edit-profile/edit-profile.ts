import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Camera, X } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../core/models/model/userResponse';
import { UserUpdate } from '../../../core/models/model/userUpdate';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss',
})
export class EditProfile implements OnDestroy {
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly ArrowLeft = ArrowLeft;
  readonly Camera = Camera;
  readonly X = X;

  username = signal('');
  bio = signal('');
  saving = signal(false);
  errorMessage = signal('');

  private pendingFile: File | null = null;
  private avatarUrl = signal<string | null>(null);
  private previewUrl = signal<string | null>(null);
  private removed = signal(false);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  displayAvatar = computed(() => this.previewUrl() ?? (this.removed() ? null : this.avatarUrl()));
  initial = computed(() => this.username().trim().charAt(0).toUpperCase() || '?');

  usernameError = computed(() => {
    const value = this.username().trim();
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (value.length > 50) return 'Username must be at most 50 characters';
    return null;
  });

  canSave = computed(() => !this.usernameError() && !this.saving());

  constructor() {
    const me = this.auth.currentUser();
    if (!me) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.username.set(me.username);
    this.bio.set(me.bio ?? '');
    this.avatarUrl.set(me.avatar_url ?? null);
  }

  ngOnDestroy() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }

  triggerFilePicker() {
    this.fileInput()?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const previous = this.previewUrl();
    if (previous) URL.revokeObjectURL(previous);

    this.pendingFile = file;
    this.previewUrl.set(URL.createObjectURL(file));
    this.removed.set(false);
    input.value = '';
  }

  removeAvatar() {
    const previous = this.previewUrl();
    if (previous) URL.revokeObjectURL(previous);

    this.pendingFile = null;
    this.previewUrl.set(null);
    this.removed.set(true);
  }

  save() {
    if (!this.canSave()) return;
    this.saving.set(true);
    this.errorMessage.set('');

    const payload: UserUpdate = {
      username: this.username().trim(),
      bio: this.bio().trim() || null,
    };
    if (this.removed()) payload.avatar_url = null;

    const update$ = this.pendingFile
      ? this.userService
          .uploadAvatar(this.pendingFile)
          .pipe(switchMap(() => this.userService.updateMe(payload)))
      : this.userService.updateMe(payload);

    update$.subscribe({
      next: (user: UserResponse) => {
        this.auth.currentUser.set(user);
        this.router.navigate(['/users', user.username]);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save changes. Try again.');
      },
    });
  }
}
