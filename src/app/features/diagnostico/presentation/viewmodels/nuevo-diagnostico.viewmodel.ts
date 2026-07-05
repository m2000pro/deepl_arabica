import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalizarImagenUseCase } from '../../domain/usecases/analizar-imagen.usecase';
import { GuardarHistorialUseCase } from '../../domain/usecases/guardar-historial.usecase';
import { ResultadoDiagnostico } from '../../domain/models/diagnostico.model';

export type EstadoAnalisis = 'vacio' | 'analizando' | 'completado';

@Injectable({ providedIn: 'root' })
export class NuevoDiagnosticoViewModel {
  
  private estadoSubject = new BehaviorSubject<EstadoAnalisis>('vacio');
  public estado$ = this.estadoSubject.asObservable();

  private resultadoSubject = new BehaviorSubject<ResultadoDiagnostico | null>(null);
  public resultado$ = this.resultadoSubject.asObservable();

  constructor(
    private analizarImagenUseCase: AnalizarImagenUseCase,
    private guardarHistorialUseCase: GuardarHistorialUseCase
  ) {}

  establecerEstado(estado: EstadoAnalisis) {
    this.estadoSubject.next(estado);
  }

  limpiarResultado() {
    this.resultadoSubject.next(null);
    this.estadoSubject.next('vacio');
  }

  procesarImagen(archivo: File): void {
    this.estadoSubject.next('analizando');

    this.analizarImagenUseCase.ejecutar(archivo).subscribe({
      next: (resultadoFormateado) => {
        this.resultadoSubject.next(resultadoFormateado);
        this.estadoSubject.next('completado');
        this.guardarEnBD(resultadoFormateado);
      },
      error: (err) => {
        alert(err.message || 'Error al conectar con la IA.');
        this.estadoSubject.next('vacio');
      }
    });
  }

  private guardarEnBD(resultado: ResultadoDiagnostico): void {
    const userData = localStorage.getItem('deepL_usuario');
    if (!userData) return;

    const user = JSON.parse(userData);
    const payloadBD = {
      usuario_id: user.id,
      parcela_id: 1, // Por defecto por ahora
      resultado: resultado.condicion,
      enfermedad: resultado.clasificacion,
      confianza: resultado.porcentajeMaximoRaw
    };

    this.guardarHistorialUseCase.ejecutar(payloadBD).subscribe({
      next: () => console.log('💾 ¡Diagnóstico guardado en la BD exitosamente!'),
      error: (err) => console.error('Error al guardar en BD:', err)
    });
  }
}