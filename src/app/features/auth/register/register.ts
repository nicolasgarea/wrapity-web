import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserRegister } from '../../../core/models/model/userRegister';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerModel = signal<UserRegister>({
    username: '',
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (register) => {
    required(register.username, { message: 'Username is required' });
    minLength(register.username, 3, { message: 'Username must be at least 3 characters' });
    maxLength(register.username, 20, { message: 'Username must be at most 20 characters' });
    required(register.email, { message: 'Email is required' });
    email(register.email, { message: 'Enter a valid email address' });
    required(register.password, { message: 'Password is required' });
    minLength(register.password, 8, { message: 'Password must be at least 8 characters' });
  });

  errorMessage = signal('');

  onSubmit(): void {
    submit(this.registerForm, async () => {
      this.authService.register(this.registerModel()).subscribe({
        next: (token) => {
          localStorage.setItem('access_token', token.access_token);
          this.authService.getMe().subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: () => {
              this.errorMessage.set('Could not load user');
            },
          });
        },
        error: (err) => {
          this.errorMessage.set(
            err.status === 409 ? 'Email or username already taken' : 'Could not create account',
          );
        },
      });
    });
  }
}
