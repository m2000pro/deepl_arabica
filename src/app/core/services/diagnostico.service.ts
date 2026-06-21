import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {
  // 1. La URL de tu IA (La que ya tenías configurada en Render)
  private iaUrl = 'https://modelo-clasificador-coffe.onrender.com'; 
  
  // 2. La URL de tu Base de Datos local (Python Puerto 5001)
  private dbUrl = 'https://backend-l-u7je.onrender.com/api/diagnosticos'; 

  constructor(private http: HttpClient) {}

  analizarImagen(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    // Llama a la IA para analizar la foto
    return this.http.post(`${this.iaUrl}/predict`, formData);
  }

  // --- ESTA ES LA FUNCIÓN QUE FALTABA ---
  guardarEnHistorial(datos: any): Observable<any> {
    // Llama a TiDB/Python para guardar el resultado
    return this.http.post(`${this.dbUrl}/guardar`, datos);
  }
}