import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportesRepository } from '../repositories/reportes.repository';
import { ReporteClima } from '../models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ObtenerClimaUseCase {
  constructor(private repository: ReportesRepository) {}

  ejecutar(): Observable<ReporteClima> {
    return this.repository.obtenerClimaActual();
  }
}