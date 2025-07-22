// src/app/pages/series/series-detail/series-detail.component.ts
import { Component, inject, computed }  from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule }                from '@angular/material/card';
import { MatButtonModule }              from '@angular/material/button';

import { SeriesService }                from '../../../core/series/series.service';
import { ProfileService }               from '../../../core/profile.service';
import { FavoritesService }             from '../../../core/favorites.service';
import type { Series }                  from '../../../core/series/series.model';

@Component({
  standalone: true,
  selector: 'app-series-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.scss']
})
export class SeriesDetailComponent {
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private svc        = inject(SeriesService);
  private profileSvc = inject(ProfileService);
  private favSvc     = inject(FavoritesService);

  // sacamos el ID de la ruta
  private id = this.route.snapshot.paramMap.get('id')!;

  // computed que se actualiza en cuanto list() cambie
  series = computed<Series | undefined>(() =>
    this.svc.list().find(s => s.id === this.id)
  );

  // computed para el cast
  castList = computed(() => {
    const s = this.series();
    if (!s) return '';
    const allCast = s.seasons.flatMap(se => se.cast);
    return Array.from(new Set(allCast)).join(', ');
  });

  // para el rol
  profile = this.profileSvc.profile;

  // -- MÉTODOS --

  playTrailer() {
    const s = this.series();
    if (s?.trailerUrl) window.open(s.trailerUrl, '_blank');
  }

  async toggleFavorite() {
    const s = this.series();
    if (!s?.id) return;
    await this.favSvc.toggle(s.id);
    // al await, la señal favoriteIds() se actualiza y la plantilla re-renderiza
  }

  isFavorite(): boolean {
    const s = this.series();
    return s?.id ? this.favSvc.isFavorite(s.id) : false;
  }

  edit() {
    const user = this.profile();
    const s = this.series();
    if (user?.role === 'admin' && s?.id) {
      this.router.navigate(['/series/edit', s.id]);
    }
  }
}
