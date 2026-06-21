import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';
  
  // Variable para controlar qué botón está verde
  filtroActivo: string = 'HOY';

  // Base de datos simulada y ampliada con categorías de tiempo
  todosLosRegistros = [
    { fecha: '05/06/2026', diagnostico: 'Positivo', enfermedad: 'Roya Amarilla', parcela: 'A - 1', categoria: 'HOY' },
    { fecha: '05/06/2026', diagnostico: 'Negativo', enfermedad: '---', parcela: 'A - 2', categoria: 'HOY' },
    { fecha: '02/06/2026', diagnostico: 'Positivo', enfermedad: 'Ojo de gallo', parcela: 'C - 2', categoria: 'ESTA SEMANA' },
    { fecha: '28/05/2026', diagnostico: 'Negativo', enfermedad: '---', parcela: 'B - 1', categoria: 'ESTE MES' },
    { fecha: '15/03/2026', diagnostico: 'Positivo', enfermedad: 'Roya Amarilla', parcela: 'A - 3', categoria: 'HACE 3 MESES' }
  ];

  // Este arreglo es el que realmente se dibuja en la tabla
  registrosAMostrar: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }
    // Al cargar la pantalla, aplicamos el filtro por defecto
    this.aplicarFiltro('HOY');
  }

  // Función que se ejecuta al hacer clic en un botón
  aplicarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    
    if (filtro === 'PLAZO PERSONALIZADO') {
      // Si elige personalizado, por ahora mostramos todo el historial completo
      this.registrosAMostrar = this.todosLosRegistros;
    } else {
      // Si elige otro, filtramos buscando coincidencias en la categoría
      this.registrosAMostrar = this.todosLosRegistros.filter(registro => registro.categoria === filtro);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/login']);
  }
}