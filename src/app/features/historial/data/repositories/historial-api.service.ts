import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { HistorialRepository } from '../../domain/repositories/historial.repository';
import { RegistroHistorial } from '../../domain/models/registro-historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialApiService implements HistorialRepository {
  private apiUrl = 'https://backend-l-u7je.onrender.com/api/historial'; 

  constructor(private http: HttpClient) {}

  obtenerRegistros(): Observable<RegistroHistorial[]> {
    // TODO: Cuando la API esté lista, descomentaremos la siguiente línea y borraremos el ejemplo
    // return this.http.get<RegistroHistorial[]>(`${this.apiUrl}/registros`);

    const mockData: RegistroHistorial[] = [
      { fecha: '05/06/2026', diagnostico: 'Positivo', enfermedad: 'Roya Amarilla', parcela: 'A - 1', categoria: 'HOY' },
      { fecha: '05/06/2026', diagnostico: 'Negativo', enfermedad: '---', parcela: 'A - 2', categoria: 'HOY' },
      { fecha: '02/06/2026', diagnostico: 'Positivo', enfermedad: 'Ojo de gallo', parcela: 'C - 2', categoria: 'ESTA SEMANA' },
      { fecha: '28/05/2026', diagnostico: 'Negativo', enfermedad: '---', parcela: 'B - 1', categoria: 'ESTE MES' },
      { fecha: '15/03/2026', diagnostico: 'Positivo', enfermedad: 'Roya Amarilla', parcela: 'A - 3', categoria: 'HACE 3 MESES' }
    ];
    // Simulamos una respuesta de red con 500ms de retraso
    return of(mockData).pipe(delay(500)); 
  }
}