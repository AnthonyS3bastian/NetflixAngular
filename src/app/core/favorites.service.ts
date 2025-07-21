// src/app/core/favorites.service.ts

import { Injectable, inject, computed, Signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from '@angular/fire/firestore';
import { AuthService }         from './auth.service';
import { MoviesService, Movie } from './movies.service';
import { toSignal }            from '@angular/core/rxjs-interop';
import { of }                  from 'rxjs';
import { switchMap, map }      from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth      = inject(AuthService);
  private firestore = inject(Firestore);
  private movies    = inject(MoviesService);

  /** Señal de array de IDs de favoritos en Firestore */
  favoriteIds: Signal<string[]> = toSignal(
    this.auth.user$.pipe(
      switchMap(user => {
        if (!user?.uid) return of<string[]>([]);
        const favCol = collection(
          this.firestore,
          'users',
          user.uid,
          'favorites'
        );
        return collectionData(favCol, { idField: 'id' }).pipe(
          map((docs: any[]) => docs.map(d => d.id))
        );
      })
    ),
    { initialValue: [] }
  );

  /** Señal de películas favoritas (Movie[]) */
  favorites: Signal<Movie[]> = computed(() => {
    const ids = this.favoriteIds();
    return this.movies
      .list()
      .filter(m => ids.includes(m.id));
  });

  /** Añade un favorito (doc.id = movieId) */
  async addFavorite(movieId: string) {
    const user = this.auth.user();
    if (!user?.uid) return;
    const favDoc = doc(
      this.firestore,
      'users',
      user.uid,
      'favorites',
      movieId
    );
    await setDoc(favDoc, { createdAt: serverTimestamp() });
  }

  /** Elimina un favorito */
  async removeFavorite(movieId: string) {
    const user = this.auth.user();
    if (!user?.uid) return;
    const favDoc = doc(
      this.firestore,
      'users',
      user.uid,
      'favorites',
      movieId
    );
    await deleteDoc(favDoc);
  }

  /** Alterna un favorito */
  toggle(movieId: string) {
    if (this.favoriteIds().includes(movieId)) {
      this.removeFavorite(movieId);
    } else {
      this.addFavorite(movieId);
    }
  }

  /** Comprueba si un movieId está en favoritos */
  isFavorite(movieId: string): boolean {
    return this.favoriteIds().includes(movieId);
  }
}
