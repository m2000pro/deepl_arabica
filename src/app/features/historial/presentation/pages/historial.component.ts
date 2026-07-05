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

  constructor(public viewModel: HistorialViewModel) {}

  ngOnInit() {
    this.viewModel.cargarHistorial(this.filtroActivo);
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