// src/app/pages/search/search.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { RouterModule }               from '@angular/router';
import { MoviesService, Movie }       from '../../core/movies.service';
import { SeriesService }              from '../../core/series/series.service';
import type { Series }                from '../../core/series/series.model';

interface SearchResult {
  type: 'movie' | 'series';
  id: string;
  title: string;
  image: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  // 1) término de búsqueda
  searchTerm = signal('');

  // 2) datos de origen (declarados aquí, se inicializan en el constructor)
  moviesLocal!: Movie[];
  seriesList!: Series[];

  // 3) computeds basados en esos datos
  filteredMovies = computed<SearchResult[]>(() =>
    this.moviesLocal
      .filter(m =>
        m.titulo.toLowerCase().includes(this.searchTerm().toLowerCase())
      )
      .map(m => ({
        type: 'movie' as const,
        id: m.id,
        title: m.titulo,
        image: m.imagen,
      }))
  );

  filteredSeries = computed<SearchResult[]>(() =>
    this.seriesList
      .filter(s =>
        s.title.toLowerCase().includes(this.searchTerm().toLowerCase())
      )
      .map(s => ({
        type: 'series' as const,
        id: s.id!,
        title: s.title,
        image: s.posterUrl,
      }))
  );

  // 4) unión de ambos resultados
  results = computed<SearchResult[]>(() => [
    ...this.filteredMovies(),
    ...this.filteredSeries(),
  ]);

  constructor(
    private moviesService: MoviesService,
    private seriesService: SeriesService
  ) {
    // aquí inicializamos los arrays, AFTER services are injected
    this.moviesLocal = this.moviesService.list();
    this.seriesList = this.seriesService.list();
  }
}
