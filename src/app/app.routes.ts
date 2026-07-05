import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // --- RUTAS DE ACCESO PÚBLICO (Agricultores) ---
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/presentation/pages/login-page.component').then(m => m.LoginPageComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/presentation/pages/register.component').then(m => m.RegisterComponent)
  },

  // --- RUTAS SECRETAS (Administradores) ---
  { 
    path: 'portal-tecnico-acceso', 
    loadComponent: () => import('./features/auth/presentation/pages/login-admin/admin-login.component').then(m => m.AdminLoginComponent)
  },
  // 👇 ¡AQUÍ ESTÁ LA RUTA QUE FALTABA! 👇
  { 
    path: 'panel-admin', 
    loadComponent: () => import('./features/admin/presentation/pages/panel-admin/panel-admin.component').then(m => m.PanelAdminComponent)
  },

  // --- RUTAS DEL SISTEMA ---
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/presentation/pages/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'nuevo-diagnostico', 
    loadComponent: () => import('./features/diagnostico/presentation/pages/nuevo-diagnostico/nuevo-diagnostico.component').then(m => m.NuevoDiagnosticoComponent)
  },
  { 
    path: 'historial', 
    loadComponent: () => import('./features/historial/presentation/pages/historial.component').then(m => m.HistorialComponent)
  },
  { 
    path: 'reportes', 
    loadComponent: () => import('./features/reportes/presentation/pages/reportes.component').then(m => m.ReportesComponent)
  }
];