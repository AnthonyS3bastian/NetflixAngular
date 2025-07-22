// src/app/pages/series/series-list/series-list.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SeriesService }     from '../../../core/series/series.service';
import type { Series }       from '../../../core/series/series.model';

@Component({
  standalone: true,
  selector: 'app-series-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent {
  private seriesService = inject(SeriesService);
  private router        = inject(Router);

  /** Usamos la señal directamente, no snapshot */
  seriesSignal = this.seriesService.list; // Signal<Series[]>

  /** Para el rol/admin, si lo necesitas */
  // private profileService = inject(ProfileService);
  // user = this.profileService.profile();

  goToDetail(id: string) {
    this.router.navigate(['/series', id]);
  }

  delete(id: string) {
    if (!confirm('¿Seguro que quieres borrar esta serie?')) return;
    this.seriesService.delete(id);
  }
}
