import { Observable } from 'rxjs';
import { RegistroHistorial } from '../models/registro-historial.model';

export abstract class HistorialRepository {
  abstract obtenerRegistros(): Observable<RegistroHistorial[]>;
}