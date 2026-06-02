import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  pantallaActual: string = 'login'; 

  usuario: string = '';
  password: string = '';

  iniciarSesion() {
    if(this.usuario && this.password) {
      this.pantallaActual = 'dashboard';
    } else {
      alert('Por favor ingresa tu usuario y contraseña.');
    }
  }

  cerrarSesion() {
    this.pantallaActual = 'login';
    this.usuario = '';
    this.password = '';
  }

  cambiarPantalla(pantalla: string) {
    this.pantallaActual = pantalla;
  }
}