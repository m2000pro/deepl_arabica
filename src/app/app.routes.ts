import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Ruta del login
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Ruta de registro (¡ESTA ES LA QUE FALTABA!)
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Ruta del dashboard
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // --- LAS DEMÁS RUTAS COMENTADAS HASTA QUE CREEMOS LOS ARCHIVOS ---
  
  { 
    path: 'nuevo-diagnostico', 
    loadComponent: () => import('./features/diagnostico/nuevo-diagnostico.component').then(m => m.NuevoDiagnosticoComponent)
  },
 
 
  { 
    path: 'historial', 
    loadComponent: () => import('./features/historial/historial.component').then(m => m.HistorialComponent)
  }
   /*
     { 
    path: 'reportes', 
    loadComponent: () => import('./features/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  */
];