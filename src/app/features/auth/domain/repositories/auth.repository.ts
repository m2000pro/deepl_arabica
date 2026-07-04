import { Observable } from 'rxjs';
import { Credenciales, Usuario } from '../models/credenciales.model';

export abstract class AuthRepository {
  abstract login(usuario: string, password: string): Observable<any>;
}