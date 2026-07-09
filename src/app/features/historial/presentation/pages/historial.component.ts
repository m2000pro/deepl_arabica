import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HistorialViewModel } from '../viewmodels/historial.viewmodel';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  filtroActivo: string = 'TODOS';
  usuarioId: number = 0;

  constructor(public viewModel: HistorialViewModel) {}

  ngOnInit() {
    // 1. Rescatamos al usuario logueado de la memoria del navegador
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      const usuario = JSON.parse(userData);
      this.usuarioId = usuario.id;
      
      // 2. Le pasamos el ID del usuario y el filtro a tu ViewModel
      // Nota: Asegúrate de que tu HistorialViewModel.cargarHistorial reciba el usuarioId como primer parámetro
      this.viewModel.cargarHistorial(this.usuarioId, this.filtroActivo);
    } else {
      console.error('No se encontró sesión activa.');
    }
  }

  aplicarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.viewModel.aplicarFiltro(filtro);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}