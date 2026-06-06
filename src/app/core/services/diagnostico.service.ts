import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {
  // Pon aquí la URL real donde está corriendo tu API de Python
  // Ejemplo: 'http://127.0.0.1:5000/analizar'
  private apiUrl = 'https://modelo-clasificador-coffe.onrender.com/predict'; 

  constructor(private http: HttpClient) {}

  analizarImagen(imagen: File): Observable<any> {
    const formData = new FormData();
    
    // 'file' es el nombre del campo que tu API de Python espera recibir. 
    // Si tu API espera otro nombre (ej. 'imagen_hoja'), cámbialo aquí.
    formData.append('file', imagen); 

    return this.http.post(this.apiUrl, formData);
  }
}