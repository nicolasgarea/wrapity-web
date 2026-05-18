import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, of, catchError } from 'rxjs';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { UserPublicResponse } from '../../core/models/model/userPublicResponse';

type ConnectionType = 'followers' | 'following';

@Component({
  selector: 'app-user-connections',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './user-connections.html',
  styleUrl: './user-connections.scss',
})
export class UserConnections {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  readonly ArrowLeft = ArrowLeft;

  username = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('username') ?? '')),
    { initialValue: '' },
  );

  type = this.route.snapshot.data['type'] as ConnectionType;
  title = this.type === 'followers' ? 'Followers' : 'Following';

  private data = toSignal(
    this.route.paramMap.pipe(
      switchMap((p) => {
        const username = p.get('username') ?? '';
        if (!username) return of(null);
        return this.userService.getByUsername(username).pipe(
          switchMap((user) =>
            this.type === 'followers'
              ? this.userService.getFollowers(user.id)
              : this.userService.getFollowing(user.id),
          ),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null as UserPublicResponse[] | null },
  );

  users = computed(() => this.data() ?? []);
  loading = computed(() => this.data() === null);

  goBack() {
    this.router.navigate(['/users', this.username()]);
  }
}
