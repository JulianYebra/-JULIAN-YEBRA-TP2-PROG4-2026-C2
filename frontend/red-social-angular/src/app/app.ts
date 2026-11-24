
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timeSesion } from '../environments/environment';
import { Auth } from './services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div *ngIf="cargando" class="pantalla-carga">
      <div class="spinner-carga" role="status" aria-label="Cargando"></div>
      <p>Verificando sesión...</p>
    </div>

    <router-outlet *ngIf="!cargando" />

    <div class="modal-fondo" *ngIf="mostrarModal">
      <div class="modal-sesion">
        <h2>Tu sesión está por vencer</h2>

        <p>Quedan 5 minutos de sesión. ¿Querés extenderla?</p>

        <button (click)="extenderSesion()">
          Extender sesión
        </button>

        <button (click)="cerrarSesion()">
          Cerrar sesión
        </button>
      </div>  
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  cargando: boolean = true;
  mostrarModal: boolean = false;

  private temporizadorAviso: ReturnType<typeof setTimeout> | null = null;
  private temporizadorVencimiento: ReturnType<typeof setTimeout> | null = null;

  private suscripcionToken!: Subscription;

  constructor(
    private readonly authService: Auth,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //Cada vez que se guarde uno nuevo, vuelve a programar el aviso y el cierre automático.
    this.suscripcionToken = this.authService.tokenActualizado.subscribe(
      (token) => {
        this.iniciarTemporizadores(token);
      }
    );

  const token = this.authService.obtenerToken();

  if (!token) {
    this.cargando = false;
    this.changeDetector.markForCheck();
    this.router.navigate(['/login']);
    return;
  }

  this.authService.autorizar(token).subscribe({

    next: (respuesta) => {
      this.authService.guardarUsuario(respuesta.usuario);

      this.cargando = false;

      this.iniciarTemporizadores(token);

      // Avisar a Angular que debe actualizar la pantalla.
      this.changeDetector.markForCheck();
    },

    error: (error) => {
      console.error('Error al validar el token:', error);

      this.cerrarSesion();
    }

  });
}

  // Programar el aviso y el vencimiento del token.
  
private iniciarTemporizadores(token: string): void {
  this.limpiarTemporizadores();

  try {
    // Obtener el payload del JWT.
    const partePayload = token.split('.')[1];

    // Convertir Base64URL a Base64.
    const base64 = partePayload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const base64Completo = base64.padEnd(
      base64.length + (4 - base64.length % 4) % 4,
      '='
    );

    const payload = JSON.parse(atob(base64Completo));

    const tiempoRestante = payload.exp * 1000 - Date.now();

    if (tiempoRestante <= 0) {
      this.cerrarSesion();
      return;
    }

// Mostrar el aviso 5 minutos antes del vencimiento.
if (tiempoRestante > timeSesion.AVISO) {
  this.temporizadorAviso = setTimeout(() => {
    this.mostrarModal = true;
    this.changeDetector.markForCheck();
  }, tiempoRestante - timeSesion.AVISO);
} else {
  this.mostrarModal = true;
  this.changeDetector.markForCheck();
}

// Cerrar la sesión cuando venza el JWT.
this.temporizadorVencimiento = setTimeout(() => {
  this.cerrarSesion();
}, tiempoRestante);

  } catch (error) {
    console.error('Error al procesar el JWT:', error);
    this.cerrarSesion();
  }
}


  // Solicitar un token nuevo al backend.
  extenderSesion(): void {
    const token = this.authService.obtenerToken();

    if (!token) {
      this.cerrarSesion();
      return;
    }

    this.authService.refrescar(token).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(respuesta.token);
        this.mostrarModal = false;
        this.changeDetector.markForCheck();
      },

      error: () => {
        this.cerrarSesion();
      }
    });
  }

  // Cerrar la sesión del usuario.
  cerrarSesion(): void {
    this.limpiarTemporizadores();
    this.authService.eliminarToken();
    this.mostrarModal = false;
    this.cargando = false;
    this.router.navigate(['/login']);
    this.changeDetector.markForCheck();
  }

  private limpiarTemporizadores(): void {
    if (this.temporizadorAviso) {
      clearTimeout(this.temporizadorAviso);
      this.temporizadorAviso = null;
    }

    if (this.temporizadorVencimiento) {
      clearTimeout(this.temporizadorVencimiento);
      this.temporizadorVencimiento = null;
    }
  }

  ngOnDestroy(): void {
    this.limpiarTemporizadores();
    this.suscripcionToken?.unsubscribe();
  }
}
