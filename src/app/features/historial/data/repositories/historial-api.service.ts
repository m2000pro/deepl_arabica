import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HistorialRepository } from '../../domain/repositories/historial.repository';
import { RegistroHistorial } from '../../domain/models/registro-historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialApiService implements HistorialRepository {
  private apiUrl = 'https://backend-pruebaaa.onrender.com/api/diagnosticos'; 

  constructor(private http: HttpClient) {}

  obtenerRegistros(usuarioId: number): Observable<RegistroHistorial[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/usuario/${usuarioId}`).pipe(
      map(datosBD => {
        if (!datosBD || datosBD.length === 0) return [];
        return datosBD.map(item => ({
          id: item.id,
          fecha: item.fecha,
          diagnostico: item.diagnostico,
          enfermedad: item.enfermedad,
          parcela: item.parcela || 'Sin asignar',
          confianza: item.confianza,
          recomendacion: item.recomendacion,
          foto_url: item.foto_url,
          categoria: this.determinarCategoria(item.fecha) 
        }));
      })
    );
  }

  actualizarParcela(diagnosticoId: number, nuevaParcela: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/historial/actualizar-parcela`, {
      id_diagnostico: diagnosticoId,
      nueva_parcela: nuevaParcela
    });
  }

  private determinarCategoria(fechaDDMMYYYY: string): string {
    if (!fechaDDMMYYYY) return 'TODOS';
    const partes = fechaDDMMYYYY.split('/');
    if (partes.length !== 3) return 'TODOS';

    const fechaRegistro = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 

    const diffTiempo = hoy.getTime() - fechaRegistro.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

    if (diffDias === 0) return 'HOY';
    if (diffDias > 0 && diffDias <= 7) return 'ESTA SEMANA';
    if (diffDias > 7 && diffDias <= 30) return 'ESTE MES';
    return 'TODOS';
  }
}