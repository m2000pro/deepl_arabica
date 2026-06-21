import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';

  // Datos simulados del clima
  clima = {
    temperatura: { actual: '22°C', max: '27°C', min: '16°C', promedio: '21°C' },
    humedad: { actual: '78%', promedio: '72%', lluviaHoy: '3.2mm', lluviaSemana: '18.4mm' },
    condicion: { viento: '12km/h', uv: 'Alto', presion: '1012hPa', alerta: 'Roya' }
  };

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