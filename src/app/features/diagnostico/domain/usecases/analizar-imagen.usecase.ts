import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiagnosticoRepository } from '../repositories/diagnostico.repository';
import { ResultadoDiagnostico, ProbabilidadFormat } from '../models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class AnalizarImagenUseCase {
  
  // Paleta de colores para el HTML
  private coloresEnfermedad: { [key: string]: string } = {
    'Healthy': '#6d9b43',
    'Leaf rust': '#FF6B6B',
    'Miner': '#FCD53F',
    'Phoma': '#A8D08D'
  };

  private nombresEnfermedad: { [key: string]: string } = {
    'Healthy': 'Sano',
    'Leaf rust': 'Roya Amarilla',
    'Miner': 'Minador de la hoja',
    'Phoma': 'Phoma (Quema)'
  };

  // Diccionario para las enfermedades individuales (las complejas vienen del backend)
  private recomendacionesBase: { [key: string]: string } = {
    'Leaf rust': 'Aplicar fungicidas a base de cobre. Realizar podas sanitarias para mejorar la ventilación y reducir la humedad.',
    'Miner': 'Usar trampas de luz o feromonas. En casos severos, aplicar insecticidas específicos.',
    'Phoma': 'Podar ramas afectadas y quemarlas. Aplicar fungicidas preventivos.',
    'Healthy': 'Tu cultivo parece estar en óptimas condiciones. Mantén el monitoreo constante.'
  };

  constructor(private repository: DiagnosticoRepository) {}

  ejecutar(archivo: File): Observable<ResultadoDiagnostico> {
    if (archivo.size > 5 * 1024 * 1024) {
      return throwError(() => new Error('El archivo excede el límite de 5MB.'));
    }

    return this.repository.analizarImagen(archivo).pipe(
      map((response: any) => {
        const diagnostico = response.diagnostico || {};

        // 1. EXTRAER PROBABILIDADES DEL NUEVO FORMATO DE PYTHON
        const listaClases = ['Healthy', 'Leaf rust', 'Miner', 'Phoma'];
        const probabilidadesFormateadas: ProbabilidadFormat[] = listaClases.map(clase => {
          let valueRaw = 0;
          if (diagnostico[clase] && diagnostico[clase].porcentaje !== undefined) {
            valueRaw = diagnostico[clase].porcentaje;
          }
          // Normalizar a escala 0-1
          if (valueRaw > 1) valueRaw = valueRaw / 100;

          return {
            nombre: this.nombresEnfermedad[clase] || clase,
            porcentaje: (valueRaw * 100).toFixed(1),
            valorRaw: valueRaw,
            color: this.coloresEnfermedad[clase] || '#4682B4'
          };
        }).sort((a, b) => b.valorRaw - a.valorRaw);

        // 2. LÓGICA HÍBRIDA DE DIAGNÓSTICO
        let condicion = 'Negativo';
        let clasificacion = 'Sano';
        let recomendacion = this.recomendacionesBase['Healthy'];
        
        const maxProbObj = probabilidadesFormateadas[0];
        let maxConfianza = maxProbObj ? maxProbObj.valorRaw * 100 : 0;

        // A. Prioridad máxima: Mensajes dinámicos del Backend (Lesión Compleja o Anomalía)
        if (diagnostico['Lesion_Compleja']?.detectado) {
          condicion = 'Positivo';
          clasificacion = 'Lesión Compleja';
          recomendacion = diagnostico['Lesion_Compleja'].mensaje || 'Tejido necrótico avanzado.';
          maxConfianza = Math.max(maxConfianza, 90.0); 
        } 
        else if (diagnostico['Anomalia']?.detectado) {
          condicion = 'Advertencia';
          clasificacion = 'Anomalía Desconocida';
          recomendacion = diagnostico['Anomalia'].mensaje || 'Posible deficiencia o daño no catalogado.';
        } 
        // B. Enfermedades regulares
        else {
          const detectadas = [
            { key: 'Leaf rust', nombre: 'Roya Amarilla' },
            { key: 'Miner', nombre: 'Minador de la hoja' },
            { key: 'Phoma', nombre: 'Phoma (Quema)' }
          ].filter(e => diagnostico[e.key]?.detectado);

          if (detectadas.length > 0) {
            condicion = 'Positivo';
            clasificacion = detectadas.map(e => e.nombre).join(' + ');
            
            // Asignamos la recomendación de la enfermedad dominante usando nuestro diccionario base
            const principal = detectadas[0].key;
            recomendacion = this.recomendacionesBase[principal] || 'Consulte con un ingeniero agrónomo.';
          }
        }

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