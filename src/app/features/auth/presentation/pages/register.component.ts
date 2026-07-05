import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegisterViewModel } from '../viewmodels/register.viewmodel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterViewModel]
})
export class RegisterComponent implements OnInit, OnDestroy {
  // Variables enlazadas al HTML original
  nombre_completo = '';
  usuario = '';
  correo_electronico = '';
  password = ''; 
  confirmar_password = ''; 
  
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: RegisterViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.viewModel.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    this.viewModel.registerSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(exito => {
        if (exito) {
          alert('¡Cuenta creada exitosamente!');
          this.router.navigate(['/login']);
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
  }

  registrar() {
    if (!this.nombre_completo || !this.usuario || !this.correo_electronico || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmar_password) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario = {
      nombre_completo: this.nombre_completo,
      usuario: this.usuario,
      correo_electronico: this.correo_electronico,
      password: this.password 
    };

    this.viewModel.registrar(nuevoUsuario);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}