// src/app/pages/series/series-detail/series-detail.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeriesService } from '../../../core/series/series.service';
import { ProfileService } from '../../../core/profile.service';
import type { Series } from '../../../core/series/series.model';

@Component({
  standalone: true,
  selector: 'app-series-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.scss']
})
export class SeriesDetailComponent implements OnInit {
  // Inyectamos sin constructor
  private route         = inject(ActivatedRoute);
  private router        = inject(Router);
  private seriesService = inject(SeriesService);
  private profileService= inject(ProfileService);

  // Ya no usamos `this` aquí en el inicializador
  series?: Series;
  user    = this.profileService.profile();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/series']);
      return;
    }
    this.seriesService.select(id);
    this.series = this.seriesService.selected();
  }

  edit(): void {
    const id = this.series?.id;
    if (id) {
      this.router.navigate(['/series/edit', id]);
    }
  }
}
