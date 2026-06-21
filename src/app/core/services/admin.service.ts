import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  // Cambiamos 127.0.0.1 por localhost para evitar bloqueos CORS del navegador
  private apiUrl = 'http://https://backend-l-u7je.onrender.com/api/admin'; 

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  cambiarEstado(usuarioId: number, nuevoEstado: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-estado`, { id: usuarioId, estado: nuevoEstado });
  }
}