import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthApiService implements AuthRepository {
  private apiUrl = 'https://backend-prueba-em2d.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, password });
  }

  registrar(nuevoUsuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, nuevoUsuario);
  }

  loginAdmin(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-login`, credenciales);
  }
}