import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnalizarImagenUseCase } from '../../domain/usecases/analizar-imagen.usecase';
import { GuardarHistorialUseCase } from '../../domain/usecases/guardar-historial.usecase';
import { ResultadoDiagnostico, PayloadHistorial } from '../../domain/models/diagnostico.model';

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

  procesarImagen(archivo: File, fotoBase64: string): void {
    console.log('⏳ 1. Iniciando análisis...');
    this.estadoSubject.next('analizando');

    this.analizarImagenUseCase.ejecutar(archivo).subscribe({
      next: (resultadoFormateado) => {
        console.log('✅ 2. IA respondió con éxito:', resultadoFormateado);
        
        // Primero enviamos los datos
        this.resultadoSubject.next(resultadoFormateado);
        
        // Luego avisamos que ya se completó el proceso
        this.estadoSubject.next('completado');

        // Y en segundo plano, guardamos en la base de datos
        this.guardarEnBD(resultadoFormateado, fotoBase64);
      },
      error: (err) => {
        console.error('❌ Error de conexión:', err);
        alert('Ocurrió un error al analizar la imagen. Revisa la consola.');
        this.estadoSubject.next('vacio');
      }
    });
  }

  private guardarEnBD(resultado: ResultadoDiagnostico, fotoBase64: string): void {
    const userData = localStorage.getItem('deepL_usuario');
    if (!userData) return;

    const user = JSON.parse(userData);
    const payloadBD: PayloadHistorial = {
      usuario_id: user.id,
      parcela_id: 1, // Se edita luego desde el historial
      resultado: resultado.condicion,
      enfermedad: resultado.clasificacion,
      confianza: resultado.porcentajeMaximoRaw,
      recomendacion: resultado.recomendacion || '', 
      foto_url: fotoBase64                          
    };

    console.log('💾 3. Guardando en Base de Datos...');
    this.guardarHistorialUseCase.ejecutar(payloadBD).subscribe({
      next: () => console.log('🎉 4. ¡Guardado en TiDB completado!'),
      error: (err) => console.error('❌ Error al guardar en BD:', err)
    });
  }
}