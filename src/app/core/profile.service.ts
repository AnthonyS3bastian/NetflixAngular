import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
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
  private injector    = inject(EnvironmentInjector);

  /** Observable puro para guards y resolvers (ya en contexto DI) */
  public profile$: Observable<UserProfile | null> =
    this.authService.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        const docRef = doc(this.firestore, 'users', user.uid);
        return runInInjectionContext(this.injector, () =>
          docData(docRef, { idField: 'uid' }).pipe(
            map((data: any) => ({
              uid:         data.uid         as string,
              displayName: data.displayName as string,
              email:       data.email       as string,
              photoURL:    data.photoURL    as string,
              role:        (data.role as any) ?? 'basic'
            }))
          )
        );
      })
    );

  /** Signal para componentes */
  public profile = toSignal<UserProfile | null>(this.profile$, {
    initialValue: null
  });

  /** Sube la foto y devuelve la URL */
  async uploadPhotoFile(file: File): Promise<string> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');
    const storageRef = ref(this.storage, `profiles/${user.uid}/avatar_${Date.now()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /** Actualiza nombre, email y foto */
  async updateProfile(data: { displayName: string; email: string; foto?: File }): Promise<void> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');

    let photoURL = user.photoURL || '';
    if (data.foto) {
      photoURL = await this.uploadPhotoFile(data.foto);
    }

    await updateFirebaseProfile(user, { displayName: data.displayName, photoURL });

    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(userDoc, {
      displayName: data.displayName,
      email:       data.email,
      photoURL
    }, { merge: true });
  }

  /** Actualiza sólo email */
  async updateEmail(newEmail: string): Promise<void> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');
    await firebaseUpdateEmail(user, newEmail);
    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(userDoc, { email: newEmail }, { merge: true });
  }

  /** Borra perfil y usuario */
  async deleteProfile(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;
    await deleteDoc(doc(this.firestore, 'users', user.uid));
    await user.delete();
  }
}
