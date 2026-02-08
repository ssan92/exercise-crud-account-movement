import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'clientes', 
        loadComponent: () => import('./features/clientes/pages/cliente-list/cliente-list').then(m => m.ClienteListComponent) 
      },
      { 
        path: 'cuentas', 
        loadComponent: () => import('./features/cuentas/pages/cuenta-list/cuenta-list').then(m => m.CuentaListComponent) 
      },

      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  }
];