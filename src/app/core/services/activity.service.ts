import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivityFeedResponse } from '../models/model/activityFeedResponse';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/activities`;

  getFollowingFeed(limit: number, offset: number): Observable<ActivityFeedResponse> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<ActivityFeedResponse>(`${this.API_URL}/following`, { params });
  }
}
