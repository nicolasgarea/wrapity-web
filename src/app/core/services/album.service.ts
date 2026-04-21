import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Album } from '../models/model/album';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/albums`;

  getTrending(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.API_URL}/trending`);
  }

  getById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.API_URL}/${id}`);
  }

  search(query: string): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.API_URL}/search`, {
      params: { q: query },
    });
  }
}
