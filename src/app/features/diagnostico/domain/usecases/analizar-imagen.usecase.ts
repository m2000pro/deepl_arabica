import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiagnosticoRepository } from '../repositories/diagnostico.repository';
import { ResultadoDiagnostico, PrediccionRaw } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class AnalizarImagenUseCase {
  
  private detallesEnfermedad: { [key: string]: { nombre: string, recomendacion: string } } = {
    'roya': { 
      nombre: 'Roya Amarilla', 
      recomendacion: 'Aplicar fungicidas a base de cobre. Realizar podas sanitarias para mejorar la ventilación y reducir la humedad en el follaje.' 
    },
    'mancha_hierro': { 
      nombre: 'Mancha de Hierro', 
      recomendacion: 'Mejorar la ventilación del cultivo y mantener un plan de fertilización equilibrado rico en potasio.' 
    },
    'minador': { 
      nombre: 'Minador de la hoja', 
      recomendacion: 'Usar trampas de luz o feromonas. En casos severos, aplicar insecticidas sistémicos específicos.' 
    },
    'phoma': { 
      nombre: 'Phoma (Quema)', 
      recomendacion: 'Podar ramas afectadas y quemarlas. Aplicar fungicidas preventivos antes de la época de lluvias.' 
    }
  };

  constructor(private repository: DiagnosticoRepository) {}

  ejecutar(archivo: File): Observable<ResultadoDiagnostico> {
    if (archivo.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('El archivo excede el límite de 5MB.'));
    }

    return this.repository.analizarImagen(archivo).pipe(
      map((response: any) => {
        const predictions: PrediccionRaw[] = response.predictions || [];
        
        let maxPred = predictions[0];
        const probabilidadesFormateadas = predictions.map(p => {
          if (p.probability > maxPred.probability) maxPred = p;
          return {
            nombre: this.detallesEnfermedad[p.class]?.nombre || p.class,
            porcentaje: (p.probability * 100).toFixed(1),
            valorRaw: p.probability
          };
        });

        const porcentajeMaximoRaw = maxPred.probability * 100;
        const enfermedadPrincipal = maxPred.class;
        const esEnferma = enfermedadPrincipal !== 'sano';

        return {
          condicion: (esEnferma && porcentajeMaximoRaw > 50) ? 'Positivo' : 'Negativo',
          clasificacion: esEnferma ? (this.detallesEnfermedad[enfermedadPrincipal]?.nombre || enfermedadPrincipal) : 'Sano',
          confianza: porcentajeMaximoRaw.toFixed(1) + '%',
          recomendacion: esEnferma 
            ? (this.detallesEnfermedad[enfermedadPrincipal]?.recomendacion || 'Consulta con un agrónomo.')
            : 'Tu cultivo parece estar en óptimas condiciones. Mantén el monitoreo constante.',
          probabilidades: probabilidadesFormateadas,
          porcentajeMaximoRaw: porcentajeMaximoRaw
        };
      })
    );
  }
}