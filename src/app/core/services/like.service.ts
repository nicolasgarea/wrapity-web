import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LikeResponse } from '../models/model/likeResponse';
import { LikeCountResponse } from '../models/model/likeCountResponse';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/reviews`;

  like(reviewId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.API_URL}/${reviewId}/like`, {});
  }

  unlike(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${reviewId}/like`);
  }

  getCount(reviewId: number): Observable<LikeCountResponse> {
    return this.http.get<LikeCountResponse>(`${this.API_URL}/${reviewId}/likes/count`);
  }
}
