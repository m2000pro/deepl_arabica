import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  iniciarSesion() {
    if (this.usuario && this.password) {
      
      this.authService.login(this.usuario, this.password).subscribe({
        next: (esValido) => {
          if (esValido) {
            // ¡Redirección activada!
            this.router.navigate(['/dashboard']); 
          } else {
            alert('Usuario o contraseña incorrectos.');
          }
        },
        error: (err) => {
          alert('Error de conexión con el servidor.');
          console.error(err);
        }
      });

    } else {
      alert('Por favor ingrese usuario y contraseña');
    }
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}