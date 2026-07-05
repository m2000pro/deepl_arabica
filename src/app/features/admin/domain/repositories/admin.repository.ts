import { Observable } from 'rxjs';
import { UsuarioAdmin } from '../models/usuario-admin.model';

export abstract class AdminRepository {
  abstract obtenerUsuarios(): Observable<UsuarioAdmin[]>;
  abstract cambiarEstado(id: number, nuevoEstado: string): Observable<any>;
}