import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  nombre: string = '';
  apellido: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmarPassword: string = '';
  fechaNacimiento: string = '';
  descripcion: string = '';

  fotoPerfil: File | null = null;

  mensajeError: string = '';
  mensajeExito: string = '';
  registrando: boolean = false;

  constructor(
    private readonly authService: Auth,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  // Obtener y validar la imagen seleccionada.
  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    this.mensajeError = '';

    if (!archivo) {
      this.fotoPerfil = null;
      return;
    }

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!tiposPermitidos.includes(archivo.type)) {
      this.mensajeError = 'La foto debe ser JPG, PNG o WEBP';
      input.value = '';
      this.fotoPerfil = null;
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.mensajeError = 'La foto no puede superar los 5 MB';
      input.value = '';
      this.fotoPerfil = null;
      return;
    }

    this.fotoPerfil = archivo;
  }

  // Validar los datos y registrar un usuario.
  registrar(): void {

    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.nombre.trim().length < 3) {
  this.mensajeError = 'El nombre debe tener al menos 3 caracteres';
  return;
  }

  if (this.apellido.trim().length < 3) {
    this.mensajeError = 'El apellido debe tener al menos 3 caracteres';
    return;
  }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email.trim())) {
      this.mensajeError = 'Ingresá un email válido';
      return;
    }

    if (this.username.trim().length < 3 ||
        this.username.trim().length > 20) {
      this.mensajeError = 'El usuario debe tener entre 3 y 20 caracteres';
      return;
    }

    const passwordValida =
      /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordValida.test(this.password)) {
      this.mensajeError =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.fechaNacimiento ||
        Number.isNaN(Date.parse(this.fechaNacimiento))) {
      this.mensajeError = 'Ingresá una fecha de nacimiento válida';
      return;
    }

    const fechaIngresada = new Date(this.fechaNacimiento + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaIngresada > hoy) {
      this.mensajeError = 'La fecha de nacimiento no puede ser futura';
      return;
    }

    if (this.descripcion.length > 200) {
      this.mensajeError = 'La descripción no puede superar los 200 caracteres';
      return;
    }

    const datos = new FormData();

    datos.append('nombre', this.nombre.trim());
    datos.append('apellido', this.apellido.trim());
    datos.append('email', this.email.trim().toLowerCase());
    datos.append('username', this.username.trim());
    datos.append('password', this.password);
    datos.append('confirmarPassword', this.confirmarPassword);
    datos.append('fechaNacimiento', this.fechaNacimiento);
    datos.append('descripcion', this.descripcion.trim());

    if (this.fotoPerfil) {
      datos.append('fotoPerfil', this.fotoPerfil);
    }

    this.registrando = true;

    this.authService.registrar(datos).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Tu cuenta fue creada correctamente!';

        console.log('Usuario registrado:', respuesta);

        this.registrando = false;
        this.changeDetector.markForCheck();
      },

      error: (error) => {
        
        const mensaje = error.error?.message;

        this.mensajeError = Array.isArray(mensaje)
          ? mensaje.join(', ')
          : mensaje || 'No se pudo completar el registro';

        this.registrando = false;
        this.changeDetector.markForCheck();
      }
    });
  }
}