import { Observable } from 'rxjs';
import { Credenciales, Usuario } from '../models/credenciales.model';

export abstract class AuthRepository {
  abstract login(usuario: string, password: string): Observable<any>;
  abstract registrar(nuevoUsuario: any): Observable<any>;
  abstract loginAdmin(credenciales: any): Observable<any>;
}