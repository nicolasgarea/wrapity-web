import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  {
    path: '',
    component: Layout,
    children: [{ path: 'home', component: Home }],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
