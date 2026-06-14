import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta el puerto al que estés usando en tu backend (ej. 5000 o 5001)
  private apiUrl = 'http://127.0.0.1:5001/api/auth'; 

  constructor(private http: HttpClient) {}

  // --- Funciones originales para USUARIOS (Agricultores/Técnicos) ---
  
  // Tu login component envía 2 parámetros separados, así que los recibimos así:
  login(usuario: string, password: string): Observable<any> {
    const credenciales = { usuario: usuario, password: password };
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  registrar(nuevoUsuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, nuevoUsuario);
  }

  // --- Funciones exclusivas para ADMINISTRADORES ---
  
  loginAdmin(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-login`, credenciales);
  }

  registroAdmin(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin-registro`, datos);
  }
}