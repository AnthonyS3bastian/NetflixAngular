// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent }            from './shared/navbar.component';
import { RouterOutlet }               from '@angular/router';
import { MoviesService }              from './core/movies.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  private moviesService = inject(MoviesService);

  async ngOnInit() {
    // Siembra las películas UNA SOLA VEZ en Firestore:
    // await this.moviesService.seedMovies();
    // Luego de confirmar en la consola de Firebase que están creadas,
    // comenta o elimina esta línea para que no vuelva a ejecutarse.
  }
}
