import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css'
})
export class Publicacion {

  @Input() publicacion: any;
  @Input() usuario: any;

  @Output() eliminar = new EventEmitter<any>();
  @Output() darLike = new EventEmitter<any>();
  @Output() quitarLike = new EventEmitter<any>();

  publicacionAEliminar = false;

  confirmarEliminar(): void {
    this.eliminar.emit(this.publicacion);
  }

  // Comprueba si el usuario actual ya dio Me gusta.
  get yaDioLike(): boolean {
    const likes = this.publicacion?.likes ?? [];

    return likes.some((like: any) => {
      const idUsuario = like?._id ?? like;
      return String(idUsuario) === String(this.usuario?.id);
    });
  }

  get esAutor(): boolean {
  const idAutor = this.publicacion?.autor?._id
    ?? this.publicacion?.autor?.id
    ?? this.publicacion?.autor;

  const idUsuario = this.usuario?.id
    ?? this.usuario?._id;

  return String(idAutor) === String(idUsuario);
}
}