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
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface UserProfile {
  uid:         string;
  displayName: string;
  email:       string;
  photoURL:    string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private authService = inject(AuthService);
  private firestore   = inject(Firestore);
  private storage     = inject(Storage);

  private profile$ = this.authService.user$.pipe(
    switchMap(user => {
      if (!user) return of(null as UserProfile | null);
      const docRef = doc(this.firestore, 'users', user.uid);
      return docData(docRef, { idField: 'uid' }).pipe(
        map(data => data as UserProfile)
      );
    })
  );

  profile = toSignal<UserProfile | null>(this.profile$, { initialValue: null });

  private async uploadPhotoFile(file: File): Promise<string> {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');
    const storageRef = ref(this.storage, `profiles/${user.uid}/avatar_${Date.now()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async updateProfile(data: {
    displayName: string;
    email:       string;
    foto?:       File;
  }) {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');

    let photoURL = user.photoURL || '';
    if (data.foto) {
      photoURL = await this.uploadPhotoFile(data.foto);
    }

    await updateFirebaseProfile(user, { displayName: data.displayName, photoURL });

    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(
      userDoc,
      { displayName: data.displayName, email: data.email, photoURL },
      { merge: true }
    );
  }

  async updateEmail(newEmail: string) {
    const user = this.authService.user();
    if (!user) throw new Error('Usuario no autenticado');

    await firebaseUpdateEmail(user, newEmail);
    const userDoc = doc(this.firestore, 'users', user.uid);
    await setDoc(userDoc, { email: newEmail }, { merge: true });
  }

  async deleteProfile() {
    const user = this.authService.user();
    if (!user) return;
    await deleteDoc(doc(this.firestore, 'users', user.uid));
    await user.delete();
  }
}
