import { Injectable, NgZone } from '@angular/core'; // <-- 1. Importa NgZone
import { BehaviorSubject } from 'rxjs';
import { ObtenerClimaUseCase } from '../../domain/usecases/obtener-clima.usecase';
import { ReporteClima } from '../../domain/models/reporte-clima.model';

@Injectable({ providedIn: 'root' })
export class ReportesViewModel {
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private climaSubject = new BehaviorSubject<ReporteClima | null>(null);
  public clima$ = this.climaSubject.asObservable();

  constructor(
    private obtenerClimaUseCase: ObtenerClimaUseCase,
    private ngZone: NgZone // <-- 2. Inyéctalo aquí
  ) {}

  cargarClima(): void {
    this.isLoadingSubject.next(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 3. Envuelve la ejecución dentro de la "Zona" de Angular
          this.ngZone.run(() => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.ejecutarUseCase(lat, lon);
          });
        },
        (error) => {
          // También es buena práctica envolver el error
          this.ngZone.run(() => {
            console.warn('Permiso de geolocalización denegado/fallido. Usando coordenadas por defecto.');
            this.ejecutarUseCase(-9.189967, -75.015152); 
          });
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