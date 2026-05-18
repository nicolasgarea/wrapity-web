import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UserRegister } from '../models/model/userRegister';
import { UserResponse } from '../models/model/userResponse';
import { Token } from '../models/model/token';
import { UserLogin } from '../models/model/userLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private API_URL = environment.apiUrl;

  currentUser = signal<UserResponse | null>(null);

  register(data: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/auth/register`, data);
  }

  login(data: UserLogin): Observable<Token> {
    return this.http.post<Token>(`${this.API_URL}/auth/login`, data);
  }

  getMe(): Observable<UserResponse> {
    return this.http
      .get<UserResponse>(`${this.API_URL}/users/me`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): void {
    const currentUrl = this.router.url;
    localStorage.removeItem('access_token');
    this.currentUser.set(null);
    this.router.navigateByUrl(currentUrl);
  }
}
