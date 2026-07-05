import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiagnosticoRepository } from '../repositories/diagnostico.repository';
import { ResultadoDiagnostico, ProbabilidadFormat } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class AnalizarImagenUseCase {
  
  constructor(private repository: DiagnosticoRepository) {}

  ejecutar(archivo: File): Observable<ResultadoDiagnostico> {
    if (archivo.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('El archivo excede el límite de 5MB.'));
    }

    return this.repository.analizarImagen(archivo).pipe(
      map((response: any) => {
        const diagnostico = response.diagnostico;
        const probs = response.probabilidades;

        const probabilidadesFormateadas: ProbabilidadFormat[] = [
          { nombre: 'Sano', porcentaje: (probs['Healthy'] * 100).toFixed(1), valorRaw: probs['Healthy'] },
          { nombre: 'Roya Amarilla', porcentaje: (probs['Leaf rust'] * 100).toFixed(1), valorRaw: probs['Leaf rust'] },
          { nombre: 'Minador', porcentaje: (probs['Miner'] * 100).toFixed(1), valorRaw: probs['Miner'] },
          { nombre: 'Phoma', porcentaje: (probs['Phoma'] * 100).toFixed(1), valorRaw: probs['Phoma'] }
        ].sort((a, b) => b.valorRaw - a.valorRaw);

        let condicion = 'Negativo';
        let clasificacion = 'Sano';
        let recomendacion = 'Tu cultivo parece estar en óptimas condiciones. Mantén el monitoreo constante.';
        let maxConfianza = probs['Healthy'] * 100;

        // A. Evaluar casos especiales (Lesión Compleja o Anomalía)
        if (diagnostico['Lesion_Compleja']?.detectado) {
          condicion = 'Positivo';
          clasificacion = 'Lesión Compleja';
          recomendacion = diagnostico['Lesion_Compleja'].mensaje;
          maxConfianza = 99.0; // Confianza simbólica alta de estrés biótico severo
        } 
        else if (diagnostico['Anomalia']?.detectado) {
          condicion = 'Advertencia';
          clasificacion = 'Anomalía Desconocida';
          recomendacion = diagnostico['Anomalia'].mensaje;
          maxConfianza = 0; // El modelo no reconoce el patrón
        } 
        // B. Evaluar las enfermedades conocidas
        else {
          const enfermedades = [
            { key: 'Leaf rust', nombre: 'Roya Amarilla' },
            { key: 'Miner', nombre: 'Minador de la hoja' },
            { key: 'Phoma', nombre: 'Phoma (Quema)' }
          ];

          let enfermedadesDetectadas = [];
          
          for (let enf of enfermedades) {
            if (diagnostico[enf.key]?.detectado) {
              enfermedadesDetectadas.push({
                nombre: enf.nombre,
                mensaje: diagnostico[enf.key].mensaje,
                prob: probs[enf.key] * 100
              });
            }
          }

          // Si hay al menos una enfermedad confirmada
          if (enfermedadesDetectadas.length > 0) {
            condicion = 'Positivo';
            clasificacion = enfermedadesDetectadas.map(e => e.nombre).join(' + ');
            recomendacion = enfermedadesDetectadas[0].mensaje; 
            maxConfianza = enfermedadesDetectadas[0].prob;
          }
        }

        // 3. Retornar el objeto con la estructura que el ViewModel y la UI exigen
        return {
          condicion: condicion,
          clasificacion: clasificacion,
          confianza: maxConfianza.toFixed(1) + '%',
          recomendacion: recomendacion,
          probabilidades: probabilidadesFormateadas,
          porcentajeMaximoRaw: maxConfianza
        };
      })
    );
  }
}