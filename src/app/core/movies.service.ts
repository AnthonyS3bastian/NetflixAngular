// src/app/core/movies.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

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
  private afs  = inject(Firestore);
  private coll = collection(this.afs, 'movies');

  /** 1) Observable real-time de Firestore */
  public allMovies$: Observable<Movie[]> =
    collectionData(this.coll, { idField: 'id' }) as Observable<Movie[]>;

  /** 2) Señal con lista inicial vacía */
  public allMovies = toSignal(this.allMovies$, { initialValue: [] as Movie[] });

  /** 3) Computed que expone siempre un array */
  public list = computed(() => this.allMovies());

  /** 4) Seed: pobla la colección UNA VEZ */
  public async seedMovies(): Promise<void> {
    const initial: Omit<Movie, 'id'>[] = [
      {
        titulo: 'Inception',
        descripcion: 'Un ladrón que roba secretos a través de sueños.',
        imagen: 'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        categoria: 'Ciencia Ficción',
        duracion: '148 min',
        estreno: '2010-07-16',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      },
      {
        titulo: 'Avengers: Endgame',
        descripcion: 'Los Vengadores luchan por restaurar el universo.',
        imagen: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
        categoria: 'Acción',
        duracion: '181 min',
        estreno: '2019-04-26',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      },
      {
        titulo: 'Destino Final',
        descripcion: 'Un grupo de jóvenes evade la muerte… solo para descubrir que ésta sigue la lista.',
        imagen: 'https://image.tmdb.org/t/p/w500/8XQ4vDBnybNxWU8KjQVXEkD6MsB.jpg',
        categoria: 'Terror',
        duracion: '98 min',
        estreno: '2000-03-17',
        trailerUrl: 'https://www.youtube.com/watch?v=D_jEYB6GRtQ',
      },
      {
        titulo: 'El Padrino',
        descripcion: 'La familia Corleone se convierte en la más poderosa del crimen organizado.',
        imagen: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        categoria: 'Crimen/Drama',
        duracion: '175 min',
        estreno: '1972-03-24',
        trailerUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
      },
      {
        titulo: 'Star Wars: Una Nueva Esperanza',
        descripcion: 'Luke Skywalker descubre la Fuerza y se une a la Rebelión.',
        imagen: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
        categoria: 'Ciencia Ficción',
        duracion: '121 min',
        estreno: '1977-05-25',
        trailerUrl: 'https://www.youtube.com/watch?v=vZ734NWnAHA',
      },
      {
        titulo: 'Harry Potter y la Piedra Filosofal',
        descripcion: 'Harry descubre que es un mago y comienza su aventura en Hogwarts.',
        imagen: 'https://image.tmdb.org/t/p/w500/6gbRmhv0F2bOfP4W6B7McJ8bSs5.jpg',
        categoria: 'Fantasía',
        duracion: '152 min',
        estreno: '2001-11-16',
        trailerUrl: 'https://www.youtube.com/watch?v=PbdM1db3JbY',
      }
    ];

    for (const m of initial) {
      await addDoc(this.coll, m);
    }
  }
}
