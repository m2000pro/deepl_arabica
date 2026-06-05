import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Ruta del login (la única que existe físicamente ahora)
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // --- LAS DEMÁS RUTAS COMENTADAS HASTA QUE CREEMOS LOS ARCHIVOS ---
  
 
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
   /*
  { 
    path: 'nuevo-diagnostico', 
    loadComponent: () => import('./features/diagnostico/nuevo-diagnostico.component').then(m => m.NuevoDiagnosticoComponent)
  },
  { 
    path: 'reportes', 
    loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  { 
    path: 'historial', 
    loadComponent: () => import('./features/historial/historial.component').then(m => m.HistorialComponent)
  }
  */
];