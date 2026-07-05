import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HistorialViewModel } from '../viewmodels/historial.viewmodel';
import { RegistroHistorial } from '../../domain/models/registro-historial.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';
  filtroActivo: string = 'HOY';
  registrosAMostrar: RegistroHistorial[] = [];
  cargando: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: HistorialViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }

    this.viewModel.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.cargando = loading);

    this.viewModel.registrosAMostrar$
      .pipe(takeUntil(this.destroy$))
      .subscribe(registros => this.registrosAMostrar = registros);

    this.viewModel.cargarHistorial(this.filtroActivo);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  aplicarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.viewModel.aplicarFiltro(filtro);
  }
}