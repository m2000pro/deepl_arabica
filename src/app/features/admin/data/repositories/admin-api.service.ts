import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminRepository } from '../../domain/repositories/admin.repository';
import { UsuarioAdmin } from '../../domain/models/usuario-admin.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService implements AdminRepository {
  // Ahora sí, apuntamos exactamente a donde Python está escuchando
  private baseUrl = 'https://backend-pruebaaa.onrender.com/api/admin'; 

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioAdmin[]> {
    // Esto llamará a: /api/admin/usuarios
    return this.http.get<UsuarioAdmin[]>(`${this.baseUrl}/usuarios`);
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<any> {
    // Esto llamará a: /api/admin/cambiar-estado
    return this.http.post(`${this.baseUrl}/cambiar-estado`, { id, estado: nuevoEstado });
  }
}