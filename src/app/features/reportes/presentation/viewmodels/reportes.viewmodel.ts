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
    this.obtenerClimaUseCase.ejecutar().subscribe({
      next: (data) => {
        this.climaSubject.next(data);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error al obtener clima', err);
        this.isLoadingSubject.next(false);
      }
    });
  }
}