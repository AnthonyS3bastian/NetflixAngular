// src/app/pages/movie-detail/movie-detail.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule }             from '@angular/material/card';
import { MatButtonModule }           from '@angular/material/button';
import { MatProgressSpinnerModule }  from '@angular/material/progress-spinner';
import { MoviesService, Movie }      from '../../core/movies.service';
import { FavoritesService }          from '../../core/favorites.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private moviesSvc   = inject(MoviesService);
  private favService  = inject(FavoritesService);

  movie?: Movie;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movie = this.moviesSvc.list().find(m => m.id === id);
    }
  }

  toggleFav() {
    if (this.movie) this.favService.toggle(this.movie.id);
  }

  isFav(): boolean {
    return this.movie ? this.favService.isFavorite(this.movie.id) : false;
  }

  playTrailer() {
    if (this.movie?.trailerUrl) {
      window.open(this.movie.trailerUrl, '_blank');
    }
  }
}
