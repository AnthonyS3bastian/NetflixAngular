// src/app/core/auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  // Este observable se actualiza si el usuario cambia
  user$ = authState(this.auth);

  // También lo transformamos a signal para usarlo con signals
  user = toSignal(this.user$, { initialValue: null });

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
