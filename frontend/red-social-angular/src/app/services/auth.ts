import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiBaseUrl = 'https://julian-yebra-tp2-prog4-2026-c2.onrender.com';
  private readonly apiUrl = `${this.apiBaseUrl}/auth`;
  private readonly usersApiUrl = `${this.apiBaseUrl}/users`;

  // Usuario que inició sesión.
  usuarioActual: any = null;

  constructor(
    private readonly http: HttpClient
  ) {}

  // Guardar los datos del usuario.
  guardarUsuario(usuario: any): void {
    this.usuarioActual = usuario;
  }


  registrar(datos: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  // Iniciar sesión.
  login(datos: {
    identificador: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  obtenerUsuarioPorId(id: string): Observable<any> {
    return this.http.get(`${this.usersApiUrl}/${encodeURIComponent(id)}`);
  }
}