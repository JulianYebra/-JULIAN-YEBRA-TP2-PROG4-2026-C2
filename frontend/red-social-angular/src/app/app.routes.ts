import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { DetallePublicacion } from './pages/detalle-publicacion/detalle-publicacion';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registro',
    component: Registro
  },
  {
    path: 'publicaciones',
    component: Publicaciones
  },
  {
    path: 'publicaciones/:id',
    component: DetallePublicacion
  },
  {
    path: 'mi-perfil',
    component: MiPerfil
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];