import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { AuthService } from './auth.service';
import { MoviesService, Movie } from './movies.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(AuthService);
  private movies = inject(MoviesService);

  // Lista de IDs favoritas en señal
  private _ids = signal<string[]>([]);
  ids = computed(() => this._ids());

  // Películas favoritas como señal
  favorites = computed<Movie[]>(() =>
    this._ids().map(id => this.movies.list().find(m => m.id === id)!).filter(m => !!m)
  );

  constructor() {
    // Al cambiar el usuario, recarga desde localStorage
    effect(() => {
      const user = this.auth.user();
      if (user?.uid) {
        const saved = localStorage.getItem(`fav-${user.uid}`);
        this._ids.set(saved ? JSON.parse(saved) : []);
      } else {
        this._ids.set([]);
      }
    });
  }

  toggle(id: string) {
    const current = this._ids();
    const next = current.includes(id)
      ? current.filter(x => x !== id)
      : [...current, id];
    this._ids.set(next);

    const user = this.auth.user();
    if (user?.uid) {
      localStorage.setItem(`fav-${user.uid}`, JSON.stringify(next));
    }
  }

  isFavorite(id: string) {
    return this._ids().includes(id);
  }
}
