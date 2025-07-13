import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '',               redirectTo: 'home',       pathMatch: 'full' },

  { 
    path: 'home',           
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent) 
  },

  { 
    path: 'series',        
    loadComponent: () => import('./pages/series/series.component')
      .then(m => m.SeriesComponent) 
  },

  { 
    path: 'peliculas',     
    loadComponent: () => import('./pages/movie/movie.component')
      .then(m => m.MovieComponent)    // ← MovieComponent, no MovieListComponent
  },

  { 
    path: 'proximamente',  
    loadComponent: () => import('./pages/upcoming/upcoming.component')
      .then(m => m.UpcomingComponent) 
  },

  { 
    path: 'favoritos',     
    loadComponent: () => import('./pages/favorite/favorites.component')
      .then(m => m.FavoritesComponent) 
  },

  { 
    path: 'movie/:id',     
    loadComponent: () => import('./pages/movie-detail/movie-detail.component')
      .then(m => m.MovieDetailComponent) 
  },

  { 
    path: 'login',         
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent) 
  },

  { 
    path: 'register',      
    loadComponent: () => import('./pages/register/register.component')
      .then(m => m.RegisterComponent) 
  },

  { 
    path: 'configuracion', 
    loadComponent: () => import('./shared/configuracion/configuracion.component')
      .then(m => m.ConfiguracionComponent)  // ← ConfiguracionComponent
  },

  { path: '**',            component: NotFoundComponent }
];
