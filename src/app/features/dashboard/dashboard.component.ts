import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Variable que mostrará el HTML
  nombreUsuario: string = 'ADMIN';

  constructor(private router: Router) {}

  ngOnInit() {
    // 1. Buscamos la sesión guardada
    const userData = localStorage.getItem('deepL_usuario');
    
    // 2. Si existe, extraemos el nombre
    if (userData) {
      const user = JSON.parse(userData);
      // Usamos el nombre_completo si lo llenaron en el registro, sino el usuario base
      this.nombreUsuario = user.usuario;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/login']);
  }
}