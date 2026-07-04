import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthApiService implements AuthRepository {
  private apiUrl = 'https://backend-l-u7je.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<any> {
    const credenciales = { usuario: usuario, password: password };
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }
}