import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthViewModel } from '../viewmodels/auth.viewmodel';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'login-page.component.html',
  styleUrls: ['login-page.component.scss'],
  providers: [AuthViewModel]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  usuario = '';
  password = '';
  contadorClicks = 0;
  temporizador: any;

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: AuthViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.viewModel.loginSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          // 1. Jalamos los datos que manda la base de datos
          const datosBase = response.usuario || { usuario: this.usuario, rol: 'USER' };
          
          // 2. Unimos los datos base y aseguramos de atrapar el correo
          const datosUsuario = {
            ...datosBase,
            correo: response.correo || datosBase.correo || datosBase.email || 'Sin registro'
          };

          // 3. Lo guardamos en memoria
          localStorage.setItem('deepL_usuario', JSON.stringify(datosUsuario));
          this.router.navigate(['/dashboard']);
        }
      });

    this.viewModel.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorMsg => {
        if (errorMsg) {
          alert(errorMsg);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.temporizador);
  }

  iniciarSesion() {
    this.viewModel.iniciarSesion(this.usuario, this.password);
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  revelarModoAdmin() {
    this.contadorClicks++;
    console.log('Presiona 5 veces para acceder a modo usuario. Llevas:', this.contadorClicks);
    clearTimeout(this.temporizador);

    if (this.contadorClicks === 5) {
      this.contadorClicks = 0;
      console.log('Accediendo a modo administrador');
      this.router.navigate(['/portal-tecnico-acceso']);
    } else {
      this.temporizador = setTimeout(() => {
        this.contadorClicks = 0;
        console.log('Tiempo agotado, reiniciando clicks.');
      }, 2000);
    }
  }
}