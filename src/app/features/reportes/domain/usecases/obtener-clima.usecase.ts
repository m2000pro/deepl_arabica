import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportesRepository } from '../repositories/reportes.repository';
import { ReporteClima } from '../models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ObtenerClimaUseCase {
  constructor(private repository: ReportesRepository) {}

  ejecutar(lat: number, lon: number): Observable<ReporteClima> {
    return this.repository.obtenerClimaActual(lat, lon);
  }
}