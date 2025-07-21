// src/app/pages/favorite/favorites.component.ts

import { Component, inject, computed, Signal } from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { RouterModule }                       from '@angular/router';
import { MatCardModule }                      from '@angular/material/card';
import { MatIconModule }                      from '@angular/material/icon';
import { FavoritesService }                   from '../../core/favorites.service';
import type { Movie }                         from '../../core/movies.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  private favSvc = inject(FavoritesService);

  /** Señal con el array de películas favoritas */
  favorites: Signal<Movie[]> = computed(() => this.favSvc.favorites());

  /** Comprueba si una película está en favoritos */
  isFavorite = (id: string) => this.favSvc.isFavorite(id);

  /** Alterna el estado favorito */
  toggleFav = (id: string) => this.favSvc.toggle(id);
}
