import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Layout } from './layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { optionalAuthGuard } from './core/guards/optional-auth-guard';
import { AuthService } from './core/services/auth.service';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: Layout,
    canActivate: [optionalAuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      {
        path: 'albums/:id',
        loadComponent: () =>
          import('./features/albums/album-detail/album-detail').then((m) => m.AlbumDetail),
      },
      {
        path: 'albums/:id/review',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/albums/review-editor/review-editor').then((m) => m.ReviewEditor),
      },
      {
        path: 'profile',
        canActivate: [
          () => {
            const router = inject(Router);
            const username = inject(AuthService).currentUser()?.username;
            return username
              ? router.createUrlTree(['/users', username])
              : router.createUrlTree(['/auth/login']);
          },
        ],
        children: [],
      },
      {
        path: 'users/:username',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'users/:username/followers',
        data: { type: 'followers' },
        loadComponent: () =>
          import('./features/user-connections/user-connections').then((m) => m.UserConnections),
      },
      {
        path: 'users/:username/following',
        data: { type: 'following' },
        loadComponent: () =>
          import('./features/user-connections/user-connections').then((m) => m.UserConnections),
      },
      {
        path: 'profile/edit',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/edit-profile/edit-profile').then((m) => m.EditProfile),
      },
      {
        path: 'profile/edit-favorites',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/profile/edit-favorites/edit-favorites').then((m) => m.EditFavorites),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/search/search').then((m) => m.Search),
      },
      {
        path: 'create',
        canActivate: [authGuard],
        data: { reviewMode: true },
        loadComponent: () => import('./features/search/search').then((m) => m.Search),
      },
      {
        path: 'activity',
        canActivate: [authGuard],
        loadComponent: () => import('./features/activity/activity').then((m) => m.Activity),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
