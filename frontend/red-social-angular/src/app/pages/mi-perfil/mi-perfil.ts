import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publications } from '../../services/publications';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {

  usuario: any = history.state.usuario ?? null;

  publicaciones: any[] = [];
  cargando = false;
  error = '';

  constructor(
    private readonly publicationsService: Publications,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisPublicaciones();
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