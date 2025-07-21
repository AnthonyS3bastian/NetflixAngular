// src/app/core/navbar/navbar.component.ts

import { Component, computed } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';

import { ProfileService } from '../core/profile.service';
import { AuthService }    from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  // Computed signal para decidir avatar
  profilePhotoUrl = computed(() => {
    const perfil = this.profileService.profile(); // Signal<UserProfile|null>
    return perfil?.photoURL ?? 'assets/images/default.png';
  });

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,  // <-- inyectamos AuthService
    private router: Router
  ) {}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  goProfile() {
    this.router.navigate(['/configuracion']);
  }
}
