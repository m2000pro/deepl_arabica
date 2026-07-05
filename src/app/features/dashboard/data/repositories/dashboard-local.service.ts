import { Injectable } from '@angular/core';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import { UsuarioDashboard } from '../../domain/models/usuario-dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardLocalService implements DashboardRepository {
  private readonly SESSION_KEY = 'deepL_usuario';

  obtenerUsuarioEnSesion(): UsuarioDashboard | null {
    const userData = localStorage.getItem(this.SESSION_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  limpiarSesion(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}