import { Component, inject, computed } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { RouterModule }                 from '@angular/router';
import { MatCardModule }                from '@angular/material/card';
import { MoviesService, Movie }         from '../../core/movies.service';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent {
  private moviesService = inject(MoviesService);
  upcomingMovies = computed<Movie[]>(() =>
    this.moviesService.list().filter(m => new Date(m.estreno) > new Date())
  );
}
