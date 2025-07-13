import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { AuthService }     from '../core/auth.service';

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
  private auth   = inject(AuthService);
  private router = inject(Router);
  user = this.auth.user;

  logout() {
    this.auth.logout().then(() => this.router.navigate(['/login']));
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }
}
