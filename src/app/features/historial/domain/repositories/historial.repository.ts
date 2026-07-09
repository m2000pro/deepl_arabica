import { Observable } from 'rxjs';
import { RegistroHistorial } from '../models/registro-historial.model';

export abstract class HistorialRepository {
  // Ahora requiere el ID del usuario
  abstract obtenerRegistros(usuarioId: number): Observable<RegistroHistorial[]>;
  
  // Nueva función declarada para que el ViewModel no marque error
  abstract actualizarParcela(diagnosticoId: number, nuevaParcela: string): Observable<any>;
}