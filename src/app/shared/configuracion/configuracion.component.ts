// src/app/shared/configuracion/configuracion.component.ts

import { Component, inject, OnInit, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { ProfileService, UserProfile } from '../../core/profile.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private profileService = inject(ProfileService);

  // Señal de perfil
  profileData!: Signal<UserProfile | null>;

  // Formularios para nombre y email
  nameForm  = this.fb.group({ nombre: ['', Validators.required] });
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Variables para foto
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  ngOnInit() {
    this.profileData = this.profileService.profile;

    // Cada vez que profile cambie, parcheamos formularios y preview
    effect(() => {
      const data = this.profileData();
      if (data) {
        this.nameForm.patchValue({ nombre: data.displayName });
        this.emailForm.patchValue({ email: data.email });
        this.previewUrl = data.photoURL;
      }
    });
  }

  saveName() {
    if (this.nameForm.invalid) {
      this.nameForm.markAllAsTouched();
      return;
    }
    const newName = this.nameForm.value.nombre!;
    const currentEmail = this.emailForm.value.email!;
    this.profileService.updateProfile({
      displayName: newName,
      email:       currentEmail
    });
  }

  saveEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const newEmail = this.emailForm.value.email!;
    const currentName = this.nameForm.value.nombre!;
    this.profileService.updateProfile({
      displayName: currentName,
      email:       newEmail
    });
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    console.log('onFileChange file=', file);
    if (!file) return;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  async savePhoto() {
    console.log('savePhoto selectedFile=', this.selectedFile);
    if (!this.selectedFile) {
      console.warn('No hay archivo seleccionado');
      return;
    }
    const displayName = this.nameForm.value.nombre!;
    const email       = this.emailForm.value.email!;

    try {
      await this.profileService.updateProfile({
        displayName,
        email,
        foto: this.selectedFile
      });
      console.log('Foto subida con éxito');
    } catch (err) {
      console.error('Error al subir foto:', err);
    }
  }
}
