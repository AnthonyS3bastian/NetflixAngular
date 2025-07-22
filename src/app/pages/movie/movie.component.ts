// src/app/pages/movie/movie.component.ts
import { Component, inject, computed } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { RouterModule }                from '@angular/router';

import {
  FeaturedMovieComponent,
  FeaturedItem
} from '../../shared/featured-movie/featured-movie.component';
import {
  CarouselComponent,
  CarouselItem
} from '../../shared/carousel/carousel.component';

import { MoviesService, Movie }        from '../../core/movies.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeaturedMovieComponent,
    CarouselComponent
  ],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  private movieService = inject(MoviesService);

  /** señal con todas las películas */
  movies = this.movieService.list;

  /** destacado aleatorio */
  featured = computed<FeaturedItem>(() => {
    const arr = this.movies();
    const m = arr[Math.floor(Math.random() * arr.length)];
    return {
      type: 'movie',
      id: m.id,
      title: m.titulo,
      description: m.descripcion,
      image: m.imagen,
      trailerUrl: m.trailerUrl
    };
  });

  /** items para el carousel */
  carouselItems = computed<CarouselItem[]>(() =>
    this.movies().map(m => ({
      type: 'movie',
      id: m.id,
      title: m.titulo,
      image: m.imagen
    }))
  );
}
