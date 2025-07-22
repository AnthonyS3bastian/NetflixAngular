// src/app/pages/series/series-form/series-form.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeriesService } from '../../../core/series/series.service';
import type { Series, Season } from '../../../core/series/series.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-series-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './series-form.component.html',
  styleUrls: ['./series-form.component.scss']
})
export class SeriesFormComponent implements OnInit {
  private fb            = inject(FormBuilder);
  private route         = inject(ActivatedRoute);
  private router        = inject(Router);
  private seriesService = inject(SeriesService);

  form = this.fb.group({
    title:       ['', Validators.required],
    description: ['', Validators.required],
    genre:       ['', Validators.required],
    seasons:     ['', Validators.required],  // JSON de Season[]
    posterUrl:   ['', Validators.required],
    releaseDate: ['', Validators.required],  // YYYY-MM-DD
    ageCategory: ['', Validators.required]
  });

  id?: string;
  isEdit = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.id) {
      this.isEdit = true;
      const s = this.seriesService.list().find(x => x.id === this.id);
      if (s) {
        // Normaliza releaseDate: Firestore Timestamp or string or Date
        let dateStr: string;
        const rd = (s.releaseDate as any);
        if (rd instanceof Timestamp) {
          dateStr = rd.toDate().toISOString().substring(0, 10);
        } else if (typeof rd === 'string' || rd instanceof String) {
          dateStr = new Date(rd as string).toISOString().substring(0, 10);
        } else if (rd instanceof Date) {
          dateStr = rd.toISOString().substring(0, 10);
        } else {
          // fallback
          dateStr = '';
        }

        this.form.patchValue({
          title:       s.title,
          description: s.description,
          genre:       s.genre,
          seasons:     JSON.stringify(s.seasons),
          posterUrl:   s.posterUrl,
          releaseDate: dateStr,
          ageCategory: s.ageCategory
        });
      }
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      title,
      description,
      genre,
      seasons: seasonsJson,
      posterUrl,
      releaseDate: releaseDateString,
      ageCategory
    } = this.form.value as {
      title: string;
      description: string;
      genre: string;
      seasons: string;
      posterUrl: string;
      releaseDate: string;
      ageCategory: string;
    };

    const payload: Omit<Series, 'id'> = {
      title,
      description,
      genre,
      seasons: JSON.parse(seasonsJson) as Season[],
      posterUrl,
      releaseDate: new Date(releaseDateString),
      ageCategory
    };

    if (this.isEdit && this.id) {
      await this.seriesService.update(this.id, payload);
    } else {
      await this.seriesService.create(payload);
    }

    this.router.navigate(['/series']);
  }
}
