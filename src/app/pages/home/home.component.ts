import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { MatCardModule }  from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MoviesService, Movie } from '../../core/movies.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,    // ← necesario para routerLink
    MatCardModule,
    MatButtonModule, // ← necesario para mat-button
  ],
  templateUrl: './home.component.html',
  styleUrls: ['.//home.component.scss'],
})
export class HomeComponent {
  private movieService = inject(MoviesService);
  movies = this.movieService.list; // signal<Movie[]>
}
