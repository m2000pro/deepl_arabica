import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { ReportesRepository } from '../../domain/repositories/reportes.repository';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ReportesApiService implements ReportesRepository {
  // Aquí irá la URL de la API de clima externa (ej. OpenWeatherMap)
  private apiUrl = 'URL_API_CLIMA_EXTERNA'; 

  constructor(private http: HttpClient) {}

  obtenerClimaActual(): Observable<ReporteClima> {
    // TODO: Implementar llamada HTTP cuando tengan la API externa
    // return this.http.get<ReporteClima>(`${this.apiUrl}/current`);

    const mockClima: ReporteClima = {
      temperatura: { actual: '22°C', max: '27°C', min: '16°C', promedio: '21°C' },
      humedad: { actual: '78%', promedio: '72%', lluviaHoy: '3.2mm', lluviaSemana: '18.4mm' },
      condicion: { viento: '12km/h', uv: 'Alto', presion: '1012hPa', alerta: 'Roya' }
    };
    
    return of(mockClima).pipe(delay(400));
  }
}