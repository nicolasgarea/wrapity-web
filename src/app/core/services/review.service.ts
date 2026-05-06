import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewFeedItemResponse } from '../models/model/reviewFeedItemResponse';
import { ReviewCreate } from '../models/model/reviewCreate';
import { ReviewUpdate } from '../models/model/reviewUpdate';
import { ReviewResponse } from '../models/model/reviewResponse';
import { ReviewFeedResponse } from '../models/model/reviewFeedResponse';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/reviews`;

  getMyReviews(): Observable<ReviewFeedItemResponse[]> {
    return this.http.get<ReviewFeedItemResponse[]>(`${this.API_URL}/me`);
  }

  getByAlbum(albumId: number, limit: number, offset: number): Observable<ReviewFeedItemResponse[]> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ReviewFeedItemResponse[]>(`${this.API_URL}/album/${albumId}`, { params });
  }

  getByUserId(userId: number, limit: number, offset: number): Observable<ReviewFeedItemResponse[]> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ReviewFeedItemResponse[]>(`${this.API_URL}/user/${userId}`, { params });
  }

  create(payload: ReviewCreate): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.API_URL, payload);
  }

  update(reviewId: number, payload: ReviewUpdate): Observable<ReviewResponse> {
    return this.http.patch<ReviewResponse>(`${this.API_URL}/${reviewId}`, payload);
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${reviewId}`);
  }

  getFollowingFeed(limit: number, offset: number): Observable<ReviewFeedResponse> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ReviewFeedResponse>(`${this.API_URL}/following`, { params });
  }
}
