import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewCreate } from '../models/model/reviewCreate';
import { ReviewUpdate } from '../models/model/reviewUpdate';
import { ReviewResponse } from '../models/model/reviewResponse';
import { ReviewFeedResponse } from '../models/model/reviewFeedResponse';
import { ReviewFeedItemResponse } from '../models/model/reviewFeedItemResponse';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/reviews`;

  getFollowingFeed(limit = 10, offset = 0): Observable<{ items: ReviewFeedItemResponse[] }> {
    return this.http.get<{ items: ReviewFeedItemResponse[] }>(`${this.API_URL}/following`, {
      params: { limit, offset },
    });
  }

  getMyReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/me`);
  }

  getByAlbum(albumId: number, limit = 20, offset = 0): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/album/${albumId}`, {
      params: { limit, offset },
    });
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
