import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Publications } from '../../services/publications';
import { Auth } from '../../services/auth';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './detalle-publicacion.html',
  styleUrl: './detalle-publicacion.css'
})
export class DetallePublicacion implements OnInit {

  publicacion: any = null;
  usuario: any = null;
  cargando = true;
  error = '';

  comentarios: any[] = [];

  cargandoComentarios = false;
  errorComentarios = '';

  offsetComentarios = 0;
  limiteComentarios = 10;
  hayMasComentarios = true;

  nuevoComentario = '';
  enviandoComentario = false;
  errorNuevoComentario = '';

  comentarioEditando: string | null = null;
  textoEditado = '';
  guardandoEdicion = false;
  errorEdicion = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly publicationsService: Publications,
    private readonly authService: Auth,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    const publicacionId = this.route.snapshot.paramMap.get('id');

    if (!publicacionId) {
      this.error = 'No se recibió el ID de la publicación.';
      this.cargando = false;
      return;
    }

    this.cargarPublicacion(publicacionId);
  }

  cargarPublicacion(id: string): void {
    this.cargando = true;
    this.error = '';

    this.publicationsService.obtenerPorId(id).subscribe({
      next: (respuesta) => {
        this.publicacion = respuesta;
        this.cargando = false;

        this.cargarComentarios();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener la publicación:', error);
        this.error = 'No se pudo cargar la publicación.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

// Obtener los comentarios de la publicación.

cargarComentarios(agregar: boolean = false): void {
  if (!this.publicacion?._id) {
    return;
  }

  this.cargandoComentarios = true;
  this.errorComentarios = '';

  this.publicationsService.listarComentarios(
    this.publicacion._id,
    this.offsetComentarios,
    this.limiteComentarios
  ).subscribe({
    next: (respuesta) => {
      const nuevosComentarios = Array.isArray(respuesta)
        ? respuesta
        : respuesta.comentarios ?? [];

      if (agregar) {
        this.comentarios = [
          ...this.comentarios,
          ...nuevosComentarios
        ];
      } else {
        this.comentarios = nuevosComentarios;
      }

      this.hayMasComentarios =
        nuevosComentarios.length === this.limiteComentarios;

      this.cargandoComentarios = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al cargar comentarios:', error);

      this.errorComentarios = 'No se pudieron cargar los comentarios.';
      this.cargandoComentarios = false;

      this.cdr.detectChanges();
    }
  });
}

// Cargar la siguiente página de comentarios.
cargarMasComentarios(): void {
  if (this.cargandoComentarios || !this.hayMasComentarios) {
    return;
  }
  
  this.offsetComentarios += this.limiteComentarios;
  console.log('Offset solicitado:', this.offsetComentarios);
  this.cargarComentarios(true);
}

agregarComentario(): void {
  const texto = this.nuevoComentario.trim();
  const usuarioId = this.usuario?.id ?? this.usuario?._id;

  if (!texto || !usuarioId || !this.publicacion?._id) {
    return;
  }

  this.enviandoComentario = true;
  this.errorNuevoComentario = '';

  this.publicationsService.comentar(
    this.publicacion._id,
    usuarioId,
    texto
  ).subscribe({
    next: () => {
      this.nuevoComentario = '';
      this.offsetComentarios = 0;
      this.comentarios = [];

      this.cargarComentarios();

      this.enviandoComentario = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al agregar comentario:', error);
      this.errorNuevoComentario = 'No se pudo agregar el comentario.';
      this.enviandoComentario = false;
      this.cdr.detectChanges();
    }
  });
}

// Comenzar a editar un comentario.
iniciarEdicion(comentario: any): void {
  this.comentarioEditando = comentario._id;
  this.textoEditado = comentario.texto;
  this.errorEdicion = '';
}

// Cancelar la edición.
cancelarEdicion(): void {
  this.comentarioEditando = null;
  this.textoEditado = '';
  this.errorEdicion = '';
}

// Guardar los cambios del comentario.
guardarEdicion(comentario: any): void {
  const texto = this.textoEditado.trim();
  const usuarioId = this.usuario?.id ?? this.usuario?._id;

  if (!texto || !usuarioId) {
    return;
  }

  this.guardandoEdicion = true;
  this.errorEdicion = '';

  this.publicationsService.editarComentario(
    this.publicacion._id,
    comentario._id,
    usuarioId,
    texto
  ).subscribe({
    next: () => {
      this.comentarioEditando = null;
      this.textoEditado = '';
      this.offsetComentarios = 0;
      this.comentarios = [];

      this.cargarComentarios();

      this.guardandoEdicion = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al editar comentario:', error);
      this.errorEdicion = 'No se pudo editar el comentario.';
      this.guardandoEdicion = false;
      this.cdr.detectChanges();
    }
  });
}
}