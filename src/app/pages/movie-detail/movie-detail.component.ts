import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MoviesService, Movie } from '../../core/movies.service';
import { FavoritesService } from '../../core/favorites.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);
  private favService = inject(FavoritesService);

  movie?: Movie;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movie = this.moviesService.list().find(m => m.id === id);
    }
  }

  toggleFav() {
    if (this.movie) {
      this.favService.toggle(this.movie.id);
    }
  }

  isFav(): boolean {
    return this.movie ? this.favService.isFavorite(this.movie.id) : false;
  }
}
