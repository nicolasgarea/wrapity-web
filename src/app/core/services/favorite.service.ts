import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FavoriteResponse } from '../models/model/favoriteResponse';
import { FavoriteItemInput } from '../models/model/favoriteItemInput';
import { FavoriteWithAlbumResponse } from '../models/model/favoriteWithAlbumResponse';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  getByUserId(userId: number): Observable<FavoriteWithAlbumResponse[]> {
    return this.http.get<FavoriteWithAlbumResponse[]>(`${this.API_URL}/favorites/user/${userId}`);
  }

  replaceMine(favorites: FavoriteItemInput[]): Observable<FavoriteWithAlbumResponse[]> {
    return this.http.put<FavoriteWithAlbumResponse[]>(`${this.API_URL}/favorites/me`, {
      favorites,
    });
  }
}
