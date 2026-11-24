
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject  } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly apiUrl = `${this.apiBaseUrl}/auth`;
  private readonly usersApiUrl = `${this.apiBaseUrl}/users`;
  private readonly tokenKey = 'token';
  tokenActualizado = new Subject<string>();

  // Usuario que inició sesión.
  usuarioActual: any = null;

  constructor(
    private readonly http: HttpClient
  ) {}

  // Guardar los datos del usuario.
  guardarUsuario(usuario: any): void {
    this.usuarioActual = usuario;
  }

  // Guardar el JWT en el almacenamiento local.
  guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenActualizado.next(token);
  }

  // Obtener el JWT guardado.
  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Eliminar el JWT.
  eliminarToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.usuarioActual = null;
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

  // Validar el JWT.
  autorizar(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/autorizar`, { token });
  }

  // Renovar el JWT.
  refrescar(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/refrescar`, { token });
  }

  obtenerUsuarioPorId(id: string): Observable<any> {
    return this.http.get(`${this.usersApiUrl}/${encodeURIComponent(id)}`);
  }
}
