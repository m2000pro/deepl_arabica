import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObtenerClimaUseCase } from '../../domain/usecases/obtener-clima.usecase';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ReportesViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private climaSubject = new BehaviorSubject<ReporteClima | null>(null);
  public clima$ = this.climaSubject.asObservable();

  constructor(private obtenerClimaUseCase: ObtenerClimaUseCase) {}

  cargarClima(): void {
    this.isLoadingSubject.next(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.ejecutarUseCase(lat, lon);
        },
        (error) => {
          console.warn('Permiso de geolocalización denegado/fallido. Usando coordenadas por defecto.');
          // Si el usuario deniega el permiso, pasamos coords genéricas (ej. centro del país)
          this.ejecutarUseCase(-9.189967, -75.015152); 
        }
      );
    } else {
      console.warn('Geolocalización no soportada. Usando coordenadas por defecto.');
      this.ejecutarUseCase(-9.189967, -75.015152);
    }
  }

  private ejecutarUseCase(lat: number, lon: number) {
    this.obtenerClimaUseCase.ejecutar(lat, lon).subscribe({
      next: (data) => {
        this.climaSubject.next(data);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error al obtener clima desde el API', err);
        this.isLoadingSubject.next(false);
      }
    });
  }
}