import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../../../core/models/model/userLogin';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);

  private router = inject(Router);

  loginModel = signal<UserLogin>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (login) => {
    required(login.email, { message: 'Email is required' });
    email(login.email, { message: 'Enter a valid email address' });
    required(login.password, { message: 'Password is required' });
  });

  errorMessage = signal('');

  onSubmit(): void {
    submit(this.loginForm, async () => {
      this.authService.login(this.loginModel()).subscribe({
        next: (token) => {
          localStorage.setItem('access_token', token.access_token);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.errorMessage.set('Invalid email or password');
        },
      });
    });
  }
}
