import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard }        from './core/auth.guard';
import { AdminGuard }       from './core/guards/admin.guard';

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

  // Rutas protegidas
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent)
      },

      // Series con CRUD y permisos
      {
    path: 'series',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/series/series-list/series-list.component')
            .then(m => m.SeriesListComponent)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/series/series-form/series-form.component')
            .then(m => m.SeriesFormComponent),
        canActivate: [AdminGuard]   // solo admin
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./pages/series/series-form/series-form.component')
            .then(m => m.SeriesFormComponent),
        canActivate: [AdminGuard]
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/series/series-detail/series-detail.component')
            .then(m => m.SeriesDetailComponent)
      }
    ]
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

      // Módulos lazy
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
