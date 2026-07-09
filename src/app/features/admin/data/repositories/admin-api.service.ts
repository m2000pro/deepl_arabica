import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminRepository } from '../../domain/repositories/admin.repository';
import { UsuarioAdmin } from '../../domain/models/usuario-admin.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService implements AdminRepository {
  // La ruta base se queda tal cual
  private apiUrl = 'https://backend-pruebaaa.onrender.com/api/usuarios'; 

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioAdmin[]> {
    // ¡Eliminamos el '/usuarios' extra! Ahora llamará exactamente a la apiUrl
    return this.http.get<UsuarioAdmin[]>(this.apiUrl);
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<any> {
    // Esto llamará correctamente a /api/usuarios/cambiar-estado
    return this.http.post(`${this.apiUrl}/cambiar-estado`, { id, estado: nuevoEstado });
  }
}