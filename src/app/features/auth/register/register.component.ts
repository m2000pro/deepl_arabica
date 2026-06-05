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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre_completo = '';
  usuario = '';
  correo_electronico = '';
  password = ''; // Usamos password
  confirmar_password = ''; // Usamos password

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
      password: this.password // Se enviará como 'password' a MockAPI
    };

    this.authService.registrar(nuevoUsuario).subscribe({
      next: () => {
        alert('¡Cuenta creada exitosamente!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error al crear la cuenta.');
        console.error(err);
      }
    });
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}