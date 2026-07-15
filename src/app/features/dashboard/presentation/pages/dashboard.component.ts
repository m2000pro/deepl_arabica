import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { DashboardViewModel } from '../viewmodels/dashboard.viewmodel';

// REPOSITORIOS DE HISTORIAL
import { HistorialRepository } from '../../../historial/domain/repositories/historial.repository';
import { HistorialApiService } from '../../../historial/data/repositories/historial-api.service';

// REPOSITORIOS DE REPORTES (CLIMA)
import { ReportesRepository } from '../../../reportes/domain/repositories/reportes.repository';
import { ReportesApiService } from '../../../reportes/data/repositories/reportes-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [
    { provide: HistorialRepository, useClass: HistorialApiService },
    { provide: ReportesRepository, useClass: ReportesApiService }
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';
  
  // Contadores reactivos de IA
  cantidadEnfermas: number = 0;
  cantidadSanas: number = 0;
  cantidadIndeterminadas: number = 0;

  // Variables reactivas de Clima
  temperaturaActual: string = '--';
  humedadActual: string = '--';

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: DashboardViewModel,
    private router: Router,
    private historialRepo: HistorialRepository,
    private reportesRepo: ReportesRepository,
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
    this.cargarClimaLocal();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrarSesion() {
    this.viewModel.cerrarSesion();
  }

  // --- LÓGICA DE HISTORIAL DE IA ---
  cargarSaludTotal() {
    const storageData = localStorage.getItem('deepL_usuario'); 
    let usuarioId = 0;

    if (storageData) {
      try { usuarioId = JSON.parse(storageData).id; } 
      catch (error) { console.error('Error al leer sesión'); }
    }

    if (!usuarioId) return; 

    this.historialRepo.obtenerRegistros(usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (registros) => {
          let enfermas = 0;
          let sanas = 0;
          let indeterminadas = 0;

          registros.forEach(r => {
            const texto = `${r.diagnostico} ${r.enfermedad}`.toLowerCase();

            if (texto.includes('positivo') || texto.includes('enferma') || texto.includes('roya') || texto.includes('minador')) {
              enfermas++;
            } else if (texto.includes('negativo') || texto.includes('sana') || texto.includes('aparentemente')) {
              sanas++;
            } else if (texto.includes('indeterminado') || texto.includes('baja certeza')) {
              indeterminadas++;
            }
          });

          this.cantidadEnfermas = enfermas;
          this.cantidadSanas = sanas;
          this.cantidadIndeterminadas = indeterminadas;
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar historial:', err)
      });
  }

  // --- LÓGICA DE CLIMA LOCAL ---
  cargarClimaLocal() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.consultarAPIClima(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocalización denegada. Usando coordenadas de Lima por defecto.');
          this.consultarAPIClima(-12.0464, -77.0428); 
        }
      );
    } else {
      console.warn('Geolocalización no soportada. Usando coordenadas de Lima por defecto.');
      this.consultarAPIClima(-12.0464, -77.0428);
    }
  }

  private consultarAPIClima(lat: number, lon: number) {
    this.reportesRepo.obtenerClimaActual(lat, lon)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clima: any) => {
          // Apuntamos directo a la propiedad "actual" dentro del objeto anidado
          const tempBruta = clima?.temperatura?.actual ?? clima?.temperaturaActual ?? clima?.temperatura ?? clima?.temp;
          const humBruta = clima?.humedad?.actual ?? clima?.humedadActual ?? clima?.humedad ?? clima?.humidity;
          
          // Forzamos la conversión a número seguro
          const tempNum = parseFloat(tempBruta);
          const humNum = parseFloat(humBruta);
          
          // Asignamos validando que no sea NaN
          this.temperaturaActual = !isNaN(tempNum) ? `${Math.round(tempNum)}°C` : '--°C';
          this.humedadActual = !isNaN(humNum) ? `${Math.round(humNum)}%` : '--%';
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar clima desde la API:', err)
      });
  }
}