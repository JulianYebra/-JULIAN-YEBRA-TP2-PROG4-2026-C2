
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Publications {

  private readonly apiUrl = `${environment.apiBaseUrl}/publications`;

  constructor(
    private readonly http: HttpClient
  ) {}

  // Obtener publicaciones.
  listar(
    orden: string = 'fecha',
    usuarioId?: string,
    offset: number = 0,
    limit: number = 10
  ): Observable<any> {

    let params = new HttpParams()
      .set('orden', orden)
      .set('offset', offset)
      .set('limit', limit);

    if (usuarioId) {
      params = params.set('usuarioId', usuarioId);
    }

    return this.http.get(this.apiUrl, { params });
  }


  // Crear una publicación.
  crear(autorId: string, datos: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${autorId}`, datos);
  }

  darLike(publicacionId: string, usuarioId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicacionId}/likes/${usuarioId}`,
      {}
    );
  }
 
  quitarLike(publicacionId: string, usuarioId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${publicacionId}/likes/${usuarioId}`
    );
  }

  eliminar(publicacionId: string, usuarioId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${publicacionId}/${usuarioId}`
    );
  }

  comentar(
    publicacionId: string,
    usuarioId: string,
    texto: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${publicacionId}/comentarios/${usuarioId}`,
      { texto }
    );
  }
}
