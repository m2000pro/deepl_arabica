import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ObtenerUsuarioUseCase } from '../../domain/usecases/obtener-usuario.usecase';
import { CerrarSesionUseCase } from '../../domain/usecases/cerrar-sesion.usecase';

@Injectable({ providedIn: 'root' })
export class DashboardViewModel {
  // Maneja el nombre que se mostrará en la UI
  private nombreUsuarioSubject = new BehaviorSubject<string>('ADMIN');
  public nombreUsuario$ = this.nombreUsuarioSubject.asObservable();

  // Evento de 1 solo uso para la redirección al login
  private logoutSuccessSubject = new Subject<void>();
  public logoutSuccess$ = this.logoutSuccessSubject.asObservable();

  constructor(
    private obtenerUsuarioUseCase: ObtenerUsuarioUseCase,
    private cerrarSesionUseCase: CerrarSesionUseCase
  ) {}

  cargarDatosUsuario(): void {
    const usuario = this.obtenerUsuarioUseCase.ejecutar();
    if (usuario) {
      // Prioriza el nombre completo si existe, si no, usa el nickname
      const nombreMostrar = usuario.nombre_completo || usuario.usuario;
      this.nombreUsuarioSubject.next(nombreMostrar);
    }
  }

  cerrarSesion(): void {
    this.cerrarSesionUseCase.ejecutar();
    this.logoutSuccessSubject.next();
  }
}