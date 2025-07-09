import { Injectable, inject, signal, computed } from '@angular/core';

export interface Movie {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  duracion: string;
  estreno: string;
  trailerUrl: string;
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private _movies = signal<Movie[]>([
    {
      id: '1',
      titulo: 'Inception',
      descripcion: 'Un ladrón que roba secretos a través de sueños.',
      imagen: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
      categoria: 'Ciencia Ficción',
      duracion: '148 min',
      estreno: '2010-07-16',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    },
    {
      id: '2',
      titulo: 'Avengers: Endgame',
      descripcion: 'Los Vengadores luchan por restaurar el universo.',
      imagen: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
      categoria: 'Acción',
      duracion: '181 min',
      estreno: '2019-04-26',
      trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    },
  ]);

  /** Lista de películas como señal */
  list = computed(() => this._movies());
}
