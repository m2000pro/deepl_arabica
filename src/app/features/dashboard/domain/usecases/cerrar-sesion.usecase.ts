import { Injectable } from '@angular/core';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable({ providedIn: 'root' })
export class CerrarSesionUseCase {
  constructor(private repository: DashboardRepository) {}

  ejecutar(): void {
    this.repository.limpiarSesion();
  }
}