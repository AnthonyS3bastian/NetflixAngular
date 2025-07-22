import { Injectable, inject, EnvironmentInjector, runInInjectionContext, signal, computed, WritableSignal, Signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable }               from 'rxjs';
import { toSignal }                from '@angular/core/rxjs-interop';
import type { Series, Season }     from './series.model';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private afs      = inject(Firestore);
  private injector = inject(EnvironmentInjector);
  private coll     = collection(this.afs, 'series');

  /** 1) Observable real-time de Firestore (ahora dentro del contexto DI) */
  public allSeries$: Observable<Series[]> =
    runInInjectionContext(this.injector, () =>
      collectionData(this.coll, { idField: 'id' }) as Observable<Series[]>
    );

  /** 2) Señal con lista inicial vacía */
  public allSeries: Signal<Series[]> =
    toSignal(this.allSeries$, { initialValue: [] as Series[] });

  /** 3) Computed que expone siempre un array */
  public list: Signal<Series[]> = computed(() => this.allSeries());

  /** 4) Señal mutable para detalle */
  public selected: WritableSignal<Series | undefined> = signal(undefined);

  /** Crea nueva serie */
  async create(data: Omit<Series, 'id'>): Promise<void> {
    await addDoc(this.coll, data);
  }

  /** Actualiza serie existente */
  async update(id: string, data: Partial<Series>): Promise<void> {
    await updateDoc(doc(this.afs, `series/${id}`), data);
  }

  /** Borra serie */
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.afs, `series/${id}`));
  }

  /** Selecciona para detalle */
  select(id: string): void {
    const found = this.list().find(s => s.id === id);
    this.selected.set(found);
  }

  /** ▶️ SEMILLA: Llama UNA VEZ para poblar ejemplo */
  async seedSeries(): Promise<void> {
    const seasonsSquid: Season[] = [{
      seasonNumber: 1,
      description: 'Competidores con problemas económicos participan en juegos mortales…',
      cast: ['Lee Jung-jae','Park Hae-soo','Wi Ha-jun'],
      episodes: 9
    }];
    await this.create({
      title: 'Squid Game',
      description: 'Sobrevive o muere en cada prueba.',
      genre: 'Drama/Suspenso',
      seasons: seasonsSquid,
      posterUrl: 'https://link-a-poster-squidgame.jpg',
      releaseDate: new Date('2021-09-17'),
      ageCategory: '16+'
    });

    const seasonsBB: Season[] = [{
      seasonNumber: 1,
      description: 'Walt se asocia con Jesse para vender metanfetamina.',
      cast: ['Bryan Cranston','Aaron Paul'],
      episodes: 7
    }];
    await this.create({
      title: 'Breaking Bad',
      description: 'Un profesor de química se convierte en fabricante de metanfetamina.',
      genre: 'Drama/Crimen',
      seasons: seasonsBB,
      posterUrl: 'https://link-a-poster-breakingbad.jpg',
      releaseDate: new Date('2008-01-20'),
      ageCategory: '18+'
    });
  }
}
