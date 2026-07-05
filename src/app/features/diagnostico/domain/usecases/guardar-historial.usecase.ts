import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiagnosticoRepository } from '../repositories/diagnostico.repository';
import { PayloadHistorial } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class GuardarHistorialUseCase {
  constructor(private repository: DiagnosticoRepository) {}

  ejecutar(payload: PayloadHistorial): Observable<any> {
    return this.repository.guardarEnHistorial(payload);
  }
}