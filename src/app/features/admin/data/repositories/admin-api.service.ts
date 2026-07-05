import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminRepository } from '../../domain/repositories/admin.repository';
import { UsuarioAdmin } from '../../domain/models/usuario-admin.model';

@Injectable({ providedIn: 'root' })
export class AdminApiService implements AdminRepository {
  private apiUrl = 'https://backend-l-u7je.onrender.com/api/admin'; 

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<UsuarioAdmin[]> {
    return this.http.get<UsuarioAdmin[]>(`${this.apiUrl}/usuarios`);
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cambiar-estado`, { id, estado: nuevoEstado });
  }
}