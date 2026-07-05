import { UsuarioDashboard } from '../models/usuario-dashboard.model';

export abstract class DashboardRepository {
  abstract obtenerUsuarioEnSesion(): UsuarioDashboard | null;
  abstract limpiarSesion(): void;
  // Nota: Aquí en el futuro agregarás: abstract obtenerClima(): Observable<any>;
}