import { Component, inject, computed }            from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { RouterModule }                           from '@angular/router';

import {
  FeaturedMovieComponent,
  FeaturedItem
} from '../../../shared/featured-movie/featured-movie.component';
import {
  CarouselComponent,
  CarouselItem
} from '../../../shared/carousel/carousel.component';

import { SeriesService }                          from '../../../core/series/series.service';
import type { Series }                            from '../../../core/series/series.model';

@Component({
  selector: 'app-series-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeaturedMovieComponent,
    CarouselComponent
  ],
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent {
  private seriesService = inject(SeriesService);

  /** señal con todas las series */
  series = this.seriesService.list;

  /** destacado aleatorio */
  featured = computed<FeaturedItem>(() => {
    const arr = this.series();
    const s = arr[Math.floor(Math.random() * arr.length)];
    return {
      type: 'series',
      id: s.id!,
      title: s.title,
      description: s.description,
      image: s.posterUrl,
      ageCategory: s.ageCategory
    };
  });

  /** items para el carousel */
  carouselItems = computed<CarouselItem[]>(() =>
    this.series().map((s: Series) => ({
      type: 'series',
      id: s.id!,
      title: s.title,
      image: s.posterUrl
    }))
  );
}
