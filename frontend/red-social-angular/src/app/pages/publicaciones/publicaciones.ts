
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publications } from '../../services/publications';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { Publicacion } from '../../components/publicacion/publicacion';

@Component({
  selector: 'app-publicaciones',
  imports: [RouterLink,FormsModule,Publicacion],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones implements OnInit {

  publicaciones: any[] = [];
  orden = 'fecha';
  limite = 5;
  offset = 0;
  cargando = false;
  error = '';
  usuario: any = null;
  titulo = '';
  descripcion = '';
  imagenSeleccionada: File | null = null;
  publicando = false;
  publicacionAEliminar: any = null;
  mostrarFormulario = false;


  constructor(
    private readonly publicationsService: Publications,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: Auth
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;
    console.log('Usuario actual:', this.usuario);
    this.cargarPublicaciones();
  }

  // Obtener publicaciones del backend.
  cargarPublicaciones(): void {
    this.cargando = true;
    this.error = '';

    this.publicationsService.listar(
    this.orden,
    undefined,
    this.offset,
    this.limite
    ).subscribe({
    next: (respuesta) => {
    this.publicaciones = respuesta;
    this.cargando = false;
    this.cdr.detectChanges();
    
  },
  error: (error) => {
    console.error('Error al cargar publicaciones:', error);
    this.error = 'No se pudieron cargar las publicaciones.';
    this.cargando = false;
    this.cdr.detectChanges();
  }
  });
  }
  // Obtener la imagen seleccionada por el usuario.
  seleccionarImagen(event: Event): void {
  const input = event.target as HTMLInputElement;

  this.imagenSeleccionada = input.files?.[0] ?? null;
  }

  // Crear una nueva publicación.
crearPublicacion(): void {

  if (!this.usuario?.id) {
    this.error = 'Debés iniciar sesión para publicar.';
    return;
  }

  if (!this.titulo.trim() || !this.descripcion.trim()) {
    this.error = 'Completá el título y la descripción.';
    return;
  }

  const datos = new FormData();

  datos.append('titulo', this.titulo.trim());
  datos.append('descripcion', this.descripcion.trim());

  if (this.imagenSeleccionada) {
    datos.append('imagen', this.imagenSeleccionada);
  }

  this.publicando = true;
  this.error = '';

  this.publicationsService.crear(this.usuario.id, datos).subscribe({

    next: () => {
      this.titulo = '';
      this.descripcion = '';
      this.imagenSeleccionada = null;
      this.publicando = false;
      this.mostrarFormulario = false;

      this.cdr.detectChanges();

      // Actualizar el listado después de publicar.
      this.cargarPublicaciones();
    },

    error: (error) => {
      console.error('Error al crear publicación:', error);

      this.error = 'No se pudo crear la publicación.';
      this.publicando = false;

      this.cdr.detectChanges();
    }

  });
}

eliminarPublicacion(publicacion: any): void {

  if (!this.usuario?.id) {
    this.error = 'Debés iniciar sesión para eliminar publicaciones.';
    return;
  }

  this.publicationsService.eliminar(
    publicacion._id,
    this.usuario.id
  ).subscribe({

    next: () => {
      this.publicacionAEliminar = null;
      this.cargarPublicaciones();
    },

    error: (error) => {
      console.error('Error al eliminar publicación:', error);

      this.error = 'No se pudo eliminar la publicación.';
      this.publicacionAEliminar = null;

      this.cdr.detectChanges();
    }

  });
}
// Solicitar confirmación antes de eliminar.
solicitarEliminar(publicacion: any): void {
  this.publicacionAEliminar = publicacion._id;
}

// Cancelar la eliminación.
cancelarEliminar(): void {
  this.publicacionAEliminar = null;
}

// Dar Me gusta a una publicación.
darLike(publicacion: any): void {
  if (!this.usuario?.id) {
    this.error = 'Debés iniciar sesión para dar Me gusta.';
    return;
  }

  this.publicationsService.darLike(
    publicacion._id,
    this.usuario.id
  ).subscribe({
    next: () => {
      this.cargarPublicaciones();
    },
    error: (error) => {
      console.error('Error al dar Me gusta:', error);
      this.error = 'No se pudo registrar el Me gusta.';
      this.cdr.detectChanges();
    }
  });
}

// Quitar Me gusta de una publicación.
quitarLike(publicacion: any): void {
  if (!this.usuario?.id) {
    this.error = 'Debés iniciar sesión para quitar el Me gusta.';
    return;
  }

  this.publicationsService.quitarLike(
    publicacion._id,
    this.usuario.id
  ).subscribe({
    next: () => {
      this.cargarPublicaciones();
    },
    error: (error) => {
      console.error('Error al quitar Me gusta:', error);
      this.error = 'No se pudo quitar el Me gusta.';
      this.cdr.detectChanges();
    }
  });
}

// Pasar a la página siguiente.
paginaSiguiente(): void {
  this.offset += this.limite;
  this.cargarPublicaciones();
}

// Volver a la página anterior.
paginaAnterior(): void {
  if (this.offset > 0) {
    this.offset -= this.limite;
    this.cargarPublicaciones();
  }
}
}
