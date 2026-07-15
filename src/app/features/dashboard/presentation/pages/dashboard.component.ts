import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { DashboardViewModel } from '../viewmodels/dashboard.viewmodel';
import { HistorialRepository } from '../../../historial/domain/repositories/historial.repository';
import { HistorialApiService } from '../../../historial/data/repositories/historial-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [
    { provide: HistorialRepository, useClass: HistorialApiService }
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';
  
  // Contadores reactivos
  cantidadEnfermas: number = 0;
  cantidadSanas: number = 0;
  cantidadIndeterminadas: number = 0; // 👈 NUEVA VARIABLE

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: DashboardViewModel,
    private router: Router,
    private historialRepo: HistorialRepository,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.viewModel.nombreUsuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe(nombre => this.nombreUsuario = nombre);

    this.viewModel.logoutSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });

    this.viewModel.cargarDatosUsuario();
    this.cargarSaludTotal(); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrarSesion() {
    this.viewModel.cerrarSesion();
  }

  cargarSaludTotal() {
    const storageData = localStorage.getItem('deepL_usuario'); 
    let usuarioId = 0;

    if (storageData) {
      try {
        usuarioId = JSON.parse(storageData).id; 
      } catch (error) {
        console.error('Error al leer sesión');
      }
    }

    if (!usuarioId) return; 

    this.historialRepo.obtenerRegistros(usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (registros) => {
          let enfermas = 0;
          let sanas = 0;
          let indeterminadas = 0; // 👈 NUEVO ACUMULADOR

          registros.forEach(r => {
            const texto = `${r.diagnostico} ${r.enfermedad}`.toLowerCase();

            // 1. Validamos Enfermas
            if (texto.includes('positivo') || texto.includes('enferma') || texto.includes('roya') || texto.includes('minador')) {
              enfermas++;
            } 
            // 2. Validamos Sanas
            else if (texto.includes('negativo') || texto.includes('sana') || texto.includes('aparentemente')) {
              sanas++;
            }
            // 3. Validamos Indeterminadas
            else if (texto.includes('indeterminado') || texto.includes('baja certeza')) {
              indeterminadas++;
            }
          });

          // Actualizamos todas las variables
          this.cantidadEnfermas = enfermas;
          this.cantidadSanas = sanas;
          this.cantidadIndeterminadas = indeterminadas; // 👈 ASIGNACIÓN
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('❌ Error de conexión:', err)
      });
  }
}