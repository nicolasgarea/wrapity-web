import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../models/model/userResponse';
import { UserPublicResponse } from '../models/model/userPublicResponse';
import { UserProfileResponse } from '../models/model/userProfileResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/users/me`);
  }

  getByUsername(username: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.API_URL}/users/by-username/${username}`);
  }

  getFollowers(userId: number): Observable<UserPublicResponse[]> {
    return this.http.get<UserPublicResponse[]>(`${this.API_URL}/users/${userId}/followers`);
  }

  getFollowing(userId: number): Observable<UserPublicResponse[]> {
    return this.http.get<UserPublicResponse[]>(`${this.API_URL}/users/${userId}/following`);
  }

  follow(userId: number): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/users/${userId}/follow`, {});
  }

  unfollow(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${userId}/follow`);
  }

  search(query: string): Observable<UserPublicResponse[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<UserPublicResponse[]>(`${this.API_URL}/users/search`, { params });
  }
}
