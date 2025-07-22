// src/app/core/profile.service.ts

import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  deleteDoc
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';
import {
  updateProfile as updateFirebaseProfile,
  updateEmail as firebaseUpdateEmail
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface UserProfile {
  uid:         string;
  displayName: string;
  email:       string;
  photoURL:    string;
  role:        'basic' | 'author' | 'userpremium' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private authService = inject(AuthService);
  private firestore   = inject(Firestore);
  private storage     = inject(Storage);

  /** 1️⃣ Observable puro para guards y resolvers */
  public profile$: Observable<UserProfile | null> =
    this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref, { idField: 'uid' }).pipe(
          map((data: any) => ({
            uid:         data.uid         as string,
            displayName: data.displayName as string,
            email:       data.email       as string,
            photoURL:    data.photoURL    as string,
            role:        (data.role as any) ?? 'basic'
          }))
        );
      })
    );

  /** 2️⃣ Signal para componentes: mismo flujo con valor inicial */
  public profile = toSignal<UserProfile | null>(this.profile$, {
    initialValue: null
  });

  /** Sube la foto a Firebase Storage y devuelve la URL */
  async uploadPhotoFile(file: File): Promise<string> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');
    const storageRef = ref(this.storage, `profiles/${user.uid}/avatar_${Date.now()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /** Actualiza nombre, email y foto en Auth + Firestore */
  async updateProfile(data: { displayName: string; email: string; foto?: File }): Promise<void> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');

    let photoURL = user.photoURL || '';
    if (data.foto) {
      photoURL = await this.uploadPhotoFile(data.foto);
    }

    // Actualiza el perfil en Auth
    await updateFirebaseProfile(user, { displayName: data.displayName, photoURL });

    // Actualiza el documento en Firestore
    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(
      userDoc,
      {
        displayName: data.displayName,
        email:       data.email,
        photoURL,
        // role: puedes permitir cambiarlo aquí si lo necesitas
      },
      { merge: true }
    );
  }

  /** Actualiza solo el email en Auth + Firestore */
  async updateEmail(newEmail: string): Promise<void> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');
    await firebaseUpdateEmail(user, newEmail);
    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(userDoc, { email: newEmail }, { merge: true });
  }

  /** Borra el perfil en Firestore y el usuario de Auth */
  async deleteProfile(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;
    await deleteDoc(doc(this.firestore, 'users', user.uid));
    await user.delete();
  }
}
