import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class RegistrarUsuarioUseCase {
  constructor(private repository: AuthRepository) {}

  ejecutar(nuevoUsuario: any): Observable<any> {
    if (!nuevoUsuario || !nuevoUsuario.usuario || !nuevoUsuario.password) {
      return throwError(() => new Error('Todos los campos obligatorios deben ser completados.'));
    }
    return this.repository.registrar(nuevoUsuario);
  }
}