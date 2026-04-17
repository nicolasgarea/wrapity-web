import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Album } from '../../../core/models/album';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrendingAlbumsService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getTrendingAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.API_URL}/albums/trending`);
  }
}
