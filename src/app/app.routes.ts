import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie-detail/movie-detail.component').then(
        m => m.MovieDetailComponent
      ),
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favorite/favorites.component').then(m => m.FavoritesComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
