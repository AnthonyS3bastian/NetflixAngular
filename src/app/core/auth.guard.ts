import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router      = inject(Router);

  async canActivate(): Promise<boolean | UrlTree> {
    // Esperamos la primera emisión del usuario
    const user = await firstValueFrom(this.authService.user$);
    if (user) {
      return true;  // ya está logeado
    }
    // si no, redirige a /login
    return this.router.createUrlTree(['/login']);
  }
}
