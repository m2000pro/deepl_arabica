import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminRepository } from '../repositories/admin.repository';
import { UsuarioAdmin } from '../models/usuario-admin.model';

@Injectable({ providedIn: 'root' })
export class ObtenerUsuariosUseCase {
  constructor(private repository: AdminRepository) {}

  ejecutar(): Observable<UsuarioAdmin[]> {
    return this.repository.obtenerUsuarios();
  }
}