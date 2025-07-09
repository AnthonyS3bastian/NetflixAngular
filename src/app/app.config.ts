import { provideRouter, Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { NotFoundComponent } from './pages/not-found.component';
import { RegisterComponent } from './pages/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent },
];

export const appConfig = {
  providers: [
    provideRouter(routes),
  ],
};
