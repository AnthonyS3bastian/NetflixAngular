import { Component, inject, computed } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { RouterModule }                from '@angular/router';

import { FeaturedMovieComponent, FeaturedItem } from '../../shared/featured-movie/featured-movie.component';
import { CarouselComponent, CarouselItem }     from '../../shared/carousel/carousel.component';

import { MoviesService, Movie }        from '../../core/movies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeaturedMovieComponent,
    CarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private movieService = inject(MoviesService);

  /** Señal con todas las películas */
  movies = this.movieService.list;

  /** Destacado aleatorio */
  featured = computed<FeaturedItem>(() => {
    const arr = this.movies();
    const m = arr[Math.floor(Math.random() * arr.length)];
    return {
      type: 'movie',
      id: m.id,
      title: m.titulo,
      description: m.descripcion,
      image: m.imagen,
      trailerUrl: m.trailerUrl,
      ageCategory: '13+' // Ajusta o extrae de tu modelo si lo tienes
    };
  });

  /** Items para carousel */
  carouselItems = computed<CarouselItem[]>(() =>
    this.movies().map(m => ({
      type: 'movie',
      id: m.id,
      title: m.titulo,
      image: m.imagen
    }))
  );
}
