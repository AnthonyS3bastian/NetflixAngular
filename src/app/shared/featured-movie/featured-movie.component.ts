import { Component, Input }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule }      from '@angular/material/button';

export interface FeaturedItem {
  type: 'movie' | 'series';
  id: string;
  title: string;
  description: string;
  image: string;
  trailerUrl?: string;
  ageCategory?: string;
}

@Component({
  selector: 'app-featured-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './featured-movie.component.html',
  styleUrls: ['./featured-movie.component.scss'],
})
export class FeaturedMovieComponent {
  @Input() item!: FeaturedItem;

  constructor(private router: Router) {}

  play() {
    if (this.item.trailerUrl) {
      window.open(this.item.trailerUrl, '_blank');
    }
  }

  moreInfo() {
    this.router.navigate(['/', this.item.type, this.item.id]);
  }
}
