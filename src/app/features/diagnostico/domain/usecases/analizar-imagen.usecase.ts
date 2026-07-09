import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiagnosticoRepository } from '../repositories/diagnostico.repository';
import { ResultadoDiagnostico } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class AnalizarImagenUseCase {
  
  private detallesEnfermedad: { [key: string]: { nombre: string, recomendacion: string } } = {
    'rust': { 
      nombre: 'Roya Amarilla', 
      recomendacion: 'Aplicar fungicidas a base de cobre. Realizar podas sanitarias para mejorar la ventilación y reducir la humedad.' 
    },
    'miner': { 
      nombre: 'Minador de la hoja', 
      recomendacion: 'Usar trampas de luz o feromonas. En casos severos, aplicar insecticidas específicos.' 
    },
    'phoma': { 
      nombre: 'Phoma (Quema)', 
      recomendacion: 'Podar ramas afectadas y quemarlas. Aplicar fungicidas preventivos.' 
    },
    'sano': {
      nombre: 'Aparentemente Sana',
      recomendacion: 'Tu cultivo parece estar en óptimas condiciones. Mantén el monitoreo constante.'
    }
  };

  constructor(private repository: DiagnosticoRepository) {}

  ejecutar(archivo: File): Observable<ResultadoDiagnostico> {
    if (archivo.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('El archivo excede el límite de 5MB.'));
    }

    return this.repository.analizarImagen(archivo).pipe(
      map((response: any) => {
        let predictions: any[] = [];
        
        // 1. EXTRACCIÓN A PRUEBA DE BALAS
        if (response && response.diagnostico) {
          for (const key in response.diagnostico) {
            const data = response.diagnostico[key];
            let prob = 0;

            // Extraemos el número dinámicamente, no importa cómo se llame la variable
            if (typeof data === 'object' && data !== null) {
              const valoresNumericos = Object.values(data).filter(v => typeof v === 'number');
              if (valoresNumericos.length > 0) {
                prob = valoresNumericos[0] as number;
              }
            } else if (typeof data === 'number') {
              prob = data;
            } else if (typeof data === 'string' && !isNaN(Number(data))) {
              prob = Number(data);
            }

            // Normalización: Si Python envía "85" en lugar de "0.85", lo ajustamos
            if (prob > 1) {
                prob = prob / 100;
            }

            predictions.push({ class: key, probability: prob });
          }
        } else {
          predictions = [{ class: 'sano', probability: 1 }];
        }

        // 2. BUSCAR EL MAYOR PORCENTAJE REAL
        const maxPred = predictions.reduce((max, current) => 
          (current.probability > max.probability) ? current : max
        , predictions[0]);

        // 3. FORMATEAR PARA LAS BARRAS VISUALES
        const probabilidadesFormateadas = predictions.map(p => ({
          nombre: this.detallesEnfermedad[p.class]?.nombre || p.class,
          porcentaje: (p.probability * 100).toFixed(1),
          valorRaw: p.probability
        }));

        // 4. LÓGICA DE DIAGNÓSTICO ESTRICTA
        const porcentajeMaximoRaw = maxPred.probability * 100;
        const enfermedadPrincipal = maxPred.class;
        
        // Es enferma si la clase no es sano Y la IA está segura a más del 50%
        const esEnferma = enfermedadPrincipal !== 'sano' && enfermedadPrincipal !== 'healthy' && porcentajeMaximoRaw > 50;

        let condicionFinal = 'Aparentemente sana';
        let clasificacionFinal = 'Sano';

        if (esEnferma) {
            condicionFinal = 'Hoja enferma';
            clasificacionFinal = this.detallesEnfermedad[enfermedadPrincipal]?.nombre || enfermedadPrincipal;
        } else if (porcentajeMaximoRaw <= 50 && enfermedadPrincipal !== 'sano') {
            condicionFinal = 'Indeterminado';
            clasificacionFinal = 'Baja certeza de enfermedad';
        }

        return {
          condicion: condicionFinal,
          clasificacion: clasificacionFinal,
          confianza: porcentajeMaximoRaw.toFixed(1) + '%',
          recomendacion: esEnferma 
            ? (this.detallesEnfermedad[enfermedadPrincipal]?.recomendacion || 'Consulta con un agrónomo.')
            : this.detallesEnfermedad['sano'].recomendacion,
          probabilidades: probabilidadesFormateadas,
          porcentajeMaximoRaw: porcentajeMaximoRaw
        };
      })
    );
  }
}