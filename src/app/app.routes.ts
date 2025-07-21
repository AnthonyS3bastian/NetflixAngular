import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard }         from './core/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // Rutas protegidas y lazy
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // Home y otras rutas eager
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'series',
        loadComponent: () =>
          import('./pages/series/series.component')
            .then(m => m.SeriesComponent)
      },
      {
        path: 'peliculas',
        loadComponent: () =>
          import('./pages/movie/movie.component')
            .then(m => m.MovieComponent)
      },
      {
        path: 'proximamente',
        loadComponent: () =>
          import('./pages/upcoming/upcoming.component')
            .then(m => m.UpcomingComponent)
      },

      // Lazy load módulos
      {
        path: 'favoritos',
        loadChildren: () =>
          import('./pages/favorite/favorites.module')
            .then(m => m.FavoritesModule)
      },
      {
        path: 'configuracion',
        loadChildren: () =>
          import('./shared/configuracion/configuracion.module')
            .then(m => m.ConfiguracionModule)
      },

      // Detalle de película
      {
        path: 'movie/:id',
        loadComponent: () =>
          import('./pages/movie-detail/movie-detail.component')
            .then(m => m.MovieDetailComponent)
      },

      // Wildcard 404
      { path: '**', component: NotFoundComponent }
    ]
  }
];
