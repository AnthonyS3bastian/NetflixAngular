import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { MatCardModule }     from '@angular/material/card';
import { MatButtonModule }   from '@angular/material/button';
import { MoviesService, Movie } from '../../core/movies.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent {
  private moviesService = inject(MoviesService);
  movies = this.moviesService.list; // signal<Movie[]>
}
