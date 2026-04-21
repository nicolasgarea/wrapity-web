import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewCreate } from '../models/model/reviewCreate';
import { ReviewUpdate } from '../models/model/reviewUpdate';
import { ReviewResponse } from '../models/model/reviewResponse';
import { ReviewFeedResponse } from '../models/model/reviewFeedResponse';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/reviews`;

  getFollowingFeed(): Observable<ReviewFeedResponse> {
    return this.http.get<ReviewFeedResponse>(`${this.API_URL}/following`);
  }

  getMyReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/me`);
  }

  getByAlbum(albumId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/album/${albumId}`);
  }

  getByUser(userId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/user/${userId}`);
  }

  create(review: ReviewCreate): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.API_URL, review);
  }

  update(reviewId: number, review: ReviewUpdate): Observable<ReviewResponse> {
    return this.http.patch<ReviewResponse>(`${this.API_URL}/${reviewId}`, review);
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${reviewId}`);
  }
}
