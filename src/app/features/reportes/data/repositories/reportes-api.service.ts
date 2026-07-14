import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportesRepository } from '../../domain/repositories/reportes.repository';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ReportesApiService implements ReportesRepository {
  // Asegúrate de que esta URL coincida con tu endpoint real
  private apiUrl = 'https://backend-prueba-em2d.onrender.com/api/reportes'; 
  //private apiUrl = 'http://127.0.0.1:5001/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerClimaActual(lat: number, lon: number): Observable<ReporteClima> {
    // Llamada HTTP real reemplazando el Mock
    return this.http.get<ReporteClima>(`${this.apiUrl}/clima?lat=${lat}&lon=${lon}`);
  }
}