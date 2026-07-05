import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class IniciarSesionAdminUseCase {
  constructor(private repository: AuthRepository) {}

  ejecutar(usuario: string, contrasena: string): Observable<any> {
    if (!usuario || !contrasena) {
      return throwError(() => new Error('Credenciales de administrador incompletas.'));
    }
    const credenciales = { usuario, contrasena };
    return this.repository.loginAdmin(credenciales);
  }
}