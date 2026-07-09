import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { ReportesRepository } from '../../domain/repositories/reportes.repository';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ReportesApiService implements ReportesRepository {
  // ✅ URL ACTUALIZADA apuntando a tu nuevo servidor en Render
  private apiUrl = 'https://backend-pruebaaa.onrender.com/api/reportes'; 

  constructor(private http: HttpClient) {}

  obtenerClimaActual(): Observable<ReporteClima> {
    // Cuando tu backend tenga la ruta de clima lista, solo descomenta la línea de abajo:
    // return this.http.get<ReporteClima>(`${this.apiUrl}/clima`);

    // Por ahora mantenemos los datos de prueba para que la interfaz se vea bien
    const mockClima: ReporteClima = {
      temperatura: { actual: '22°C', max: '27°C', min: '16°C', promedio: '21°C' },
      humedad: { actual: '78%', promedio: '72%', lluviaHoy: '3.2mm', lluviaSemana: '18.4mm' },
      condicion: { viento: '12km/h', uv: 'Alto', presion: '1012hPa', alerta: 'Roya' }
    };
    
    return of(mockClima).pipe(delay(400));
  }
}