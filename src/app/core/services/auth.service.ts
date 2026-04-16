import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserRegister } from '../../core/models/userRegister';
import { Observable } from 'rxjs';
import { UserResponse } from '../../core/models/userResponse';
import { UserLogin } from '../../core/models/userLogin';
import { Token } from '../models/token';

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
}
