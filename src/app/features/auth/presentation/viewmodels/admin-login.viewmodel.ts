import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject} from 'rxjs';
import { IniciarSesionAdminUseCase } from '../../domain/usecases/login-admin.usecase';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  private adminLoginSuccessSubject = new Subject<any>(); 
  public adminLoginSuccess$ = this.adminLoginSuccessSubject.asObservable();

  constructor(private iniciarSesionAdminUseCase: IniciarSesionAdminUseCase) {}

  loginAdmin(usuario: string, contrasena: string): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    this.iniciarSesionAdminUseCase.ejecutar(usuario, contrasena).subscribe({
      next: (response) => {
        if (response) {
          this.adminLoginSuccessSubject.next(response);
        } else {
          this.errorSubject.next('Credenciales incorrectas.');
        }
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        let mensaje = 'Error al conectar con la base de datos TiDB.';
        if (err.status === 401 || err.status === 403) mensaje = 'Acceso denegado: Credenciales no válidas.';
        else if (err.message) mensaje = err.message;

        this.errorSubject.next(mensaje);
        this.isLoadingSubject.next(false);
      }
    });
  }
}