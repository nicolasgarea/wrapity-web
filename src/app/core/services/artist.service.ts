import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Artist } from '../models/model/artist';
import { Album } from '../models/model/album';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/artists`;

  search(query: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.API_URL}/search`, {
      params: { q: query },
    });
  }

  getById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.API_URL}/${id}`);
  }

  getAlbums(id: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.API_URL}/${id}/albums`);
  }
}
