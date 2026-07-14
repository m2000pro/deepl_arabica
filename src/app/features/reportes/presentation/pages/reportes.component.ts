import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReportesViewModel } from '../viewmodels/reportes.viewmodel';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';
  clima: ReporteClima | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: ReportesViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }

    this.viewModel.clima$
      .pipe(takeUntil(this.destroy$))
      .subscribe(datosClima => {
        if (datosClima) {
          console.log('✅ Clima recibido en Angular:', datosClima); // <-- Nuevo Log
          this.clima = datosClima;
        }
      });

    this.viewModel.cargarClima();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}