import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrarUsuarioUseCase } from '../../domain/usecases/register.usecase';

@Injectable()
export class RegisterViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  private registerSuccessSubject = new BehaviorSubject<boolean>(false);
  public registerSuccess$ = this.registerSuccessSubject.asObservable();

  constructor(private registrarUsuarioUseCase: RegistrarUsuarioUseCase) {}

  registrar(datosRegistro: any): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    this.registrarUsuarioUseCase.ejecutar(datosRegistro).subscribe({
      next: (response) => {
        this.registerSuccessSubject.next(true);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        this.errorSubject.next(err.message || 'Error al conectar con el servidor.');
        this.isLoadingSubject.next(false);
      }
    });
  }
}