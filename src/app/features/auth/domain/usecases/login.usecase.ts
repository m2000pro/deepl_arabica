import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class IniciarSesionUseCase {
  constructor(private repository: AuthRepository) {}

  ejecutar(usuario: string, password: string): Observable<any> {
    if (!usuario || !password) {
      return throwError(() => new Error('Por favor ingrese usuario y contraseña'));
    }
    return this.repository.login(usuario, password);
  }
}