import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ReviewResponse } from '../../../core/models/model/reviewResponse';

@Injectable({
  providedIn: 'root',
})
export class FollowingReviewsService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getFollowingReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.API_URL}/reviews/response`);
  }
}
