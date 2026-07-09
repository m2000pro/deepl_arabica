import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistorialRepository } from '../repositories/historial.repository';
import { RegistroHistorial } from '../models/registro-historial.model';

@Injectable({ providedIn: 'root' })
export class ObtenerHistorialUseCase {
  constructor(private repository: HistorialRepository) {}

  // AHORA RECIBE EL ID Y SE LO PASA AL REPOSITORIO
  ejecutar(usuarioId: number): Observable<RegistroHistorial[]> {
    return this.repository.obtenerRegistros(usuarioId);
  }
}