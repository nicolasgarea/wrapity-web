import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { switchMap } from 'rxjs';
import { ArtistService } from '../../../core/services/artist.service';
import { Album } from '../../../core/models/model/album';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './artist-detail.html',
  styleUrl: './artist-detail.scss',
})
export class ArtistDetail {
  id = input.required<string>();

  private artistService = inject(ArtistService);
  private location = inject(Location);

  readonly ArrowLeft = ArrowLeft;

  artist = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.artistService.getById(Number(id)))),
  );

  albums = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.artistService.getAlbums(Number(id)))),
    { initialValue: [] as Album[] },
  );

  albumCount = computed(() => this.artist()?.nb_album ?? this.albums().length);

  goBack() {
    this.location.back();
  }
}
