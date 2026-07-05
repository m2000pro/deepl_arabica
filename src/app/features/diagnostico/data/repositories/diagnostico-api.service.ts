import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiagnosticoRepository } from '../../domain/repositories/diagnostico.repository';
import { PayloadHistorial } from '../../domain/models/diagnostico.model';

@Injectable({ providedIn: 'root' })
export class DiagnosticoApiService implements DiagnosticoRepository {
  private iaUrl = 'https://modelo-clasificador-coffe.onrender.com'; 
  private dbUrl = 'https://backend-prueba-em2d.onrender.com/api/diagnosticos'; 

  constructor(private http: HttpClient) {}

  analizarImagen(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post(`${this.iaUrl}/predict`, formData);
  }

  guardarEnHistorial(datos: PayloadHistorial): Observable<any> {
    return this.http.post(`${this.dbUrl}/guardar`, datos);
  }
}