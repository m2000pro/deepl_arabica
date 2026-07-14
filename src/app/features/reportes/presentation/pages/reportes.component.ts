import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReportesViewModel } from '../viewmodels/reportes.viewmodel';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';
  
  // Ya no necesitamos la variable 'clima' ni 'destroy$'

  constructor(
    public viewModel: ReportesViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }

    // Solo disparamos la acción. El HTML se suscribirá automáticamente.
    this.viewModel.cargarClima();
  }
}