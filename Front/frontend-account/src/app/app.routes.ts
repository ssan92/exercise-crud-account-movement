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
      { 
        path: 'movimientos', 
        loadComponent: () => import('./features/movimientos/pages/movimiento-list/movimiento-list').then(m => m.MovimientoListComponent) 
      },
      { 
        path: 'reportes', 
        loadComponent: () => import('./features/reportes/pages/reporte-list/reporte-list').then(m => m.ReporteListComponent) 
      },

      { path: '', redirectTo: 'clientes', pathMatch: 'full' }
    ]
  }
];