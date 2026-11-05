import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
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


  mostrarDatos(): void {
  console.log({
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    username: this.username,
    password: this.password,
    fechaNacimiento: this.fechaNacimiento,
    descripcion: this.descripcion
  });
}
}