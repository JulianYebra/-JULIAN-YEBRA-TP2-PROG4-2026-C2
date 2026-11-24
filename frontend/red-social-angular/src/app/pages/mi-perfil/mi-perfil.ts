import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publications } from '../../services/publications';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink,FormsModule,DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  readonly apiBaseUrl = environment.apiBaseUrl;
  usuario: any = history.state?.usuario ?? null;

  publicaciones: any[] = [];
  cargando = false;
  error = '';
  cargandoUsuario = false;
  errorUsuario = '';
  comentariosTexto: { [id: string]: string } = {};
  enviandoComentario: string | null = null;

  constructor(
    private readonly publicationsService: Publications,
    private readonly authService: Auth,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = history.state?.usuario ?? this.authService.usuarioActual ?? null;

    if (this.usuario?.id) {
      this.cargarDatosActualizados(this.usuario.id);
    }

    this.cargarMisPublicaciones();
  }

  private cargarDatosActualizados(id: string): void {
    this.cargandoUsuario = true;
    this.errorUsuario = '';

    this.authService.obtenerUsuarioPorId(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.authService.guardarUsuario(usuario);
        this.cargandoUsuario = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.errorUsuario = 'No se pudieron actualizar los datos del perfil.';
        this.cargandoUsuario = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarMisPublicaciones(): void {

    if (!this.usuario?.id) {
      return;
    }

    this.cargando = true;

    this.publicationsService.listar(
      'fecha',
      this.usuario.id,
      0,
      3
    ).subscribe({
      next: (respuesta) => {
        this.publicaciones = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar mis publicaciones:', error);
        this.error = 'No se pudieron cargar tus publicaciones.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

comentar(publicacion: any): void {
  const texto = this.comentariosTexto[publicacion._id]?.trim();

  if (!texto) {
    return;
  }

  if (!this.usuario?.id) {
    this.error = 'Debés iniciar sesión para comentar.';
    return;
  }

  this.enviandoComentario = publicacion._id;
  this.error = '';

  this.publicationsService.comentar(
    publicacion._id,
    this.usuario.id,
    texto
  ).subscribe({
    next: () => {
      this.comentariosTexto[publicacion._id] = '';
      this.enviandoComentario = null;
      this.cargarMisPublicaciones();
    },
    error: (error) => {
      console.error('Error al comentar:', error);
      this.error = 'No se pudo publicar el comentario.';
      this.enviandoComentario = null;
      this.cdr.detectChanges();
    }
  });
}

}