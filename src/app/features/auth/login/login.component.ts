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
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario = '';
  password = '';

  // --- VARIABLES PARA EL TRUCO SECRETO ---
  contadorClicks = 0;
  temporizador: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  iniciarSesion() {
    if (this.usuario && this.password) {
      this.authService.login(this.usuario, this.password).subscribe({
        next: (esValido: any) => { 
          if (esValido) {
            const datosUsuario = esValido.usuario || { usuario: this.usuario, rol: 'USER' };
            localStorage.setItem('deepL_usuario', JSON.stringify(datosUsuario));
            this.router.navigate(['/dashboard']); 
          } else {
            alert('Usuario o contraseña incorrectos.');
          }
        },
        error: (err: any) => { 
          if (err.status === 401) {
            alert('Usuario o contraseña incorrectos.');
          } else {
            alert('Error de conexión con el servidor.');
          }
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

  // --- FUNCIÓN DEL GATILLO OCULTO (MEJORADA) ---
  revelarModoAdmin() {
    this.contadorClicks++;
    
    // Imprimimos en consola para que veas que sí está funcionando
    console.log('🕵️‍♂️ Clic secreto detectado. Llevas:', this.contadorClicks);
    
    // 1. Limpiamos el reloj anterior para que no te interrumpa
    clearTimeout(this.temporizador);

    // 2. Comprobamos si ya llegaste a 5
    if (this.contadorClicks === 5) {
      this.contadorClicks = 0;
      console.log('🚀 ¡BINGO! Teletransportando al portal admin...');
      this.router.navigate(['/portal-tecnico-acceso']);
    } else {
      // 3. Si aún no llegas a 5, te damos 1.5 segundos para hacer el siguiente clic
      this.temporizador = setTimeout(() => {
        this.contadorClicks = 0; 
        console.log('⏱️ Tiempo agotado. Se reiniciaron los clics a 0.');
      }, 1500); 
    }
  }
}