
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  identificador: string = '';
  password: string = '';

  mensajeError: string = '';
  mensajeExito: string = '';
  ingresando: boolean = false;

  constructor(
    private readonly authService: Auth,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  iniciarSesion(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    this.ingresando = true;

    this.authService.login({
      identificador: this.identificador,
      password: this.password
    }).subscribe({

      next: (respuesta) => {
        this.mensajeExito = '¡Inicio de sesión exitoso!';

        console.log('Usuario autenticado:', respuesta);

        this.ingresando = false;

        this.router.navigate(['/mi-perfil'], {
          state: {
            usuario: respuesta.usuario
          }
        });
      },

      error: (error) => {
        const mensaje = error.error?.message;

        this.mensajeError = Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje || 'No se pudo iniciar sesión';

        this.ingresando = false;
        this.changeDetector.markForCheck();
      }

    });
  }
}
