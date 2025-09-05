import { Routes } from '@angular/router';
import { Facturacion } from './facturacion/facturacion';
import { Usuarios } from './users-modulo/usuarios/usuarios';
import { NuevoUsuario } from './users-modulo/nuevo-usuario/nuevo-usuario';
import { EditarUsuario } from './users-modulo/editar-usuario/editar-usuario';


export const routes: Routes = [
  { path: 'facturas', component: Facturacion },
  { path: 'users', component: Usuarios },
  { path: 'new-user', component: NuevoUsuario },
  { path: 'edit-user/:id', component: EditarUsuario },    
];