import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IniciarSesionUseCase } from '../../domain/usecases/login.usecase';

@Injectable()
export class AuthViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  private loginSuccessSubject = new Subject<any>();
  public loginSuccess$ = this.loginSuccessSubject.asObservable();

  constructor(private iniciarSesionUseCase: IniciarSesionUseCase) {}

  iniciarSesion(usuario: string, password: string): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    this.iniciarSesionUseCase.ejecutar(usuario, password).subscribe({
      next: (response) => {
        if (response) {
          this.loginSuccessSubject.next(response);
        } else {
          this.errorSubject.next('Usuario o contraseña incorrectos.');
        }
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        let mensaje = 'Error de conexión con el servidor.';
        if (err.status === 401) mensaje = 'Usuario o contraseña incorrectos.';
        else if (err.message) mensaje = err.message;

        this.errorSubject.next(mensaje);
        this.isLoadingSubject.next(false);
      }
    });
  }
}