import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService }        from '../../core/auth.service';

// Importa Firestore y funciones
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb        = inject(FormBuilder);
  private auth      = inject(AuthService);
  private router    = inject(Router);
  private firestore= inject(Firestore);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;

    try {
      const cred = await this.auth.register(email!, password!);
      const user = cred.user;

      // 1️⃣ Crea el documento en Firestore con role por defecto
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        uid:         user.uid,
        displayName: user.displayName || '',
        email:       user.email,
        photoURL:    user.photoURL || '',
        role:        'basic'    // rol inicial
      });

      console.log('✅ Usuario registrado y perfil creado en Firestore:', user.uid);

      // 2️⃣ Redirigimos a home
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('❌ Error en registro:', err);
    }
  }
}
