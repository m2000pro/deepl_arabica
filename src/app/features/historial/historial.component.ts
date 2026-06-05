import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';

  // Datos simulados exactamente como en tu Figma
  registros = [
    { fecha: '25/05/2026', diagnostico: 'Positivo', enfermedad: 'Roya', parcela: 'A - 3' },
    { fecha: '24/05/2026', diagnostico: 'Positivo', enfermedad: 'Ojo de gallo', parcela: 'C - 2' },
    { fecha: '23/05/2026', diagnostico: 'Negativo', enfermedad: '---', parcela: 'B - 1' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/login']);
  }
}