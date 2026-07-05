import { Observable } from 'rxjs';
import { PayloadHistorial } from '../models/diagnostico.model';

export abstract class DiagnosticoRepository {
  abstract analizarImagen(archivo: File): Observable<any>;
  abstract guardarEnHistorial(datos: PayloadHistorial): Observable<any>;
}