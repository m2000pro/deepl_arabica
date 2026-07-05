import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObtenerUsuariosUseCase } from '../../domain/usecases/obtener-usuarios.usecase';
import { CambiarEstadoUseCase } from '../../domain/usecases/cambiar-estado.usecase';
import { UsuarioAdmin } from '../../domain/models/usuario-admin.model';

@Injectable({ providedIn: 'root' })
export class PanelAdminViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private usuariosSubject = new BehaviorSubject<UsuarioAdmin[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  constructor(
    private obtenerUsuariosUseCase: ObtenerUsuariosUseCase,
    private cambiarEstadoUseCase: CambiarEstadoUseCase
  ) {}

  cargarUsuarios(): void {
    this.isLoadingSubject.next(true);
    this.obtenerUsuariosUseCase.ejecutar().subscribe({
      next: (data) => {
        this.usuariosSubject.next(data);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        alert('No se pudo cargar la lista de usuarios. Revisa la consola.');
        this.isLoadingSubject.next(false);
      }
    });
  }

  cambiarEstado(usuario: UsuarioAdmin): void {
    this.isLoadingSubject.next(true);
    
    this.cambiarEstadoUseCase.ejecutar(usuario.id, usuario.estado).subscribe({
      next: () => {
        this.cargarUsuarios(); // Recarga la tabla con los datos actualizados
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('No se pudo cambiar el estado del usuario.');
        this.isLoadingSubject.next(false);
      }
    });
  }
}