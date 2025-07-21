import { NgModule }                   from '@angular/core';
import { CommonModule }               from '@angular/common';
import { RouterModule }               from '@angular/router';
import { ReactiveFormsModule }        from '@angular/forms';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatButtonModule }            from '@angular/material/button';
import { ConfiguracionComponent }     from './configuracion.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    // Ruta interna '' para este módulo
    RouterModule.forChild([
      { path: '', component: ConfiguracionComponent }
    ])
  ]
})
export class ConfiguracionModule {}
