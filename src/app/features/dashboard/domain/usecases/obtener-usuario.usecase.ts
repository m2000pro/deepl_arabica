import { Injectable } from '@angular/core';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { UsuarioDashboard } from '../models/usuario-dashboard.model';

@Injectable({ providedIn: 'root' })
export class ObtenerUsuarioUseCase {
  constructor(private repository: DashboardRepository) {}

  ejecutar(): UsuarioDashboard | null {
    return this.repository.obtenerUsuarioEnSesion();
  }
}