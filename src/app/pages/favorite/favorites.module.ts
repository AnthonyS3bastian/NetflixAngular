import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { MatListModule }      from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    // Defino la ruta interna '' para este módulo
    RouterModule.forChild([
      { path: '', component: FavoritesComponent }
    ])
  ]
})
export class FavoritesModule {}
