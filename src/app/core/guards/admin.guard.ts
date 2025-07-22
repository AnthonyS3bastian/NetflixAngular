// src/app/core/guards/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ProfileService } from '../profile.service';
import { filter, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const AdminGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return profileService['profile$']  // usamos el observable interno profile$
    .pipe(
      // 1. Espera hasta que profile$ emita algo distinto de null
      filter((u) => u !== null),
      take(1),
      // 2. Si es admin devuelve true, si no devuelve un UrlTree a /home
      map((u) => {
        if (u!.role === 'admin') {
          return true;
        }
        return router.parseUrl('/home');
      })
    );
};
