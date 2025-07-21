// src/app/pages/home/home.component.ts

import { Component, inject }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { RouterModule }           from '@angular/router';
import { MatCardModule }          from '@angular/material/card';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';

import { MoviesService, Movie }   from '../../core/movies.service';
import { FavoritesService }       from '../../core/favorites.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,    // para routerLink
    MatCardModule,   // para las tarjetas
    MatButtonModule, // para botones
    MatIconModule    // para <mat-icon>
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private movieService = inject(MoviesService);
  private favService   = inject(FavoritesService);

  /** Señal con la lista de películas */
  movies = this.movieService.list;  // Signal<Movie[]>

  /** Devuelve true si el id está en favoritos */
  isFavorite    = (id: string) => this.favService.isFavorite(id);

  /** Alterna el estado favorito */
  toggleFavorite = (id: string) => this.favService.toggle(id);
}
