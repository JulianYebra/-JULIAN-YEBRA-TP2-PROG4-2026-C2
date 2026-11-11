import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiUrl = 'https://julian-yebra-tp2-prog4-2026-c2.onrender.com/auth';

  constructor(
    private readonly http: HttpClient
  ) {}

  // Registrar un usuario.
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
}