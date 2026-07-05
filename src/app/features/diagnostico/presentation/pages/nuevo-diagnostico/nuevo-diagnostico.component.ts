import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NuevoDiagnosticoViewModel, EstadoAnalisis } from '../../viewmodels/nuevo-diagnostico.viewmodel';
import { ResultadoDiagnostico } from '../../../domain/models/diagnostico.model';

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nuevo-diagnostico.component.html',
  styleUrls: ['./nuevo-diagnostico.component.scss']
})
export class NuevoDiagnosticoComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';
  imagenUrl: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null; 
  estadoAnalisis: EstadoAnalisis = 'vacio';
  resultado: ResultadoDiagnostico | null = null;

  private destroy$ = new Subject<void>();

  constructor(public viewModel: NuevoDiagnosticoViewModel) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }

    this.viewModel.estado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(estado => this.estadoAnalisis = estado);

    this.viewModel.resultado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => this.resultado = res);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.archivoSeleccionado = file;
      this.viewModel.establecerEstado('vacio');
    }
  }

  analizar() {
    if (this.archivoSeleccionado) {
      this.viewModel.procesarImagen(this.archivoSeleccionado);
    }
  }

  descartar() {
    this.imagenUrl = null;
    this.archivoSeleccionado = null;
    this.viewModel.limpiarResultado();
  }
}