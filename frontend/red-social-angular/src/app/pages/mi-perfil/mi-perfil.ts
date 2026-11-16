import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publications } from '../../services/publications';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  usuario: any = history.state?.usuario ?? null;

  publicaciones: any[] = [];
  cargando = false;
  error = '';
  cargandoUsuario = false;
  errorUsuario = '';

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

}