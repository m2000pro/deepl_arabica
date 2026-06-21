import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre_completo = '';
  usuario = '';
  correo_electronico = '';
  password = ''; 
  confirmar_password = ''; 

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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

    this.authService.registrar(nuevoUsuario).subscribe({
      // 1. Opcional: añadimos res: any por si usas la respuesta luego
      next: (res: any) => {
        alert('¡Cuenta creada exitosamente!');
        this.router.navigate(['/login']);
      },
      // 2. Agregamos ": any" aquí
      error: (err: any) => {
        // Mostramos el error específico si el usuario ya existe
        const mensajeError = err.error?.error || 'Error al crear la cuenta.';
        alert(mensajeError);
        console.error(err);
      }
    });
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}