import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../models/model/userResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/users/me`);
  }
}
