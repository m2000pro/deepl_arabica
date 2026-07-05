import { Observable } from 'rxjs';
import { ReporteClima } from '../models/reporte-clima.model';

export abstract class ReportesRepository {
  abstract obtenerClimaActual(): Observable<ReporteClima>;
}