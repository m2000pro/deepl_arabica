import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  id?: string;
  usuario: string; 
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ATENCIÓN: Reemplaza esta URL con el endpoint de tu proyecto en MockAPI
    private apiUrl = 'https://6a2244ee5c61035328698b82.mockapi.io/usuario';
  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<boolean> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?usuario=${usuario}`).pipe(
      map(usuarios => {
        const user = usuarios[0];
        if (user && user.password === password) {
          localStorage.setItem('deepL_usuario', JSON.stringify(user));
          return true;
        }
        return false;
      })
    );
  }
}