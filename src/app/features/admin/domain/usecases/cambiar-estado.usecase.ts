import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AdminRepository } from '../repositories/admin.repository';

@Injectable({ providedIn: 'root' })
export class CambiarEstadoUseCase {
  constructor(private repository: AdminRepository) {}

  ejecutar(id: number, estadoActual: string): Observable<any> {
    if (!id) {
      return throwError(() => new Error('ID de usuario no válido.'));
    }
    const nuevoEstado = estadoActual === 'Activo' ? 'Suspendido' : 'Activo';
    return this.repository.cambiarEstado(id, nuevoEstado);
  }
}