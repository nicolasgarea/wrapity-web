import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserRegister } from '../models/model/userRegister';
import { UserResponse } from '../models/model/userResponse';
import { Token } from '../models/model/token';
import { UserLogin } from '../models/model/userLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  register(data: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/auth/register`, data);
  }

  login(data: UserLogin): Observable<Token> {
    return this.http.post<Token>(`${this.API_URL}/auth/login`, data);
  }

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/users/me`);
  }
}
