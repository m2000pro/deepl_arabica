import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent {
  
  // Función para el botón de contraseña
  cambiarContrasena() {
    alert('Se enviará un enlace a tu correo para restablecer la contraseña.');
  }
}