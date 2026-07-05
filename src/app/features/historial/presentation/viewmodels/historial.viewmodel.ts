import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObtenerHistorialUseCase } from '../../domain/usecases/obtener-historial.usecase';
import { RegistroHistorial } from '../../domain/models/registro-historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialViewModel {
  private todosLosRegistros: RegistroHistorial[] = [];

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private registrosAMostrarSubject = new BehaviorSubject<RegistroHistorial[]>([]);
  public registrosAMostrar$ = this.registrosAMostrarSubject.asObservable();

  constructor(private obtenerHistorialUseCase: ObtenerHistorialUseCase) {}

  cargarHistorial(filtroInicial: string = 'HOY'): void {
    this.isLoadingSubject.next(true);
    this.obtenerHistorialUseCase.ejecutar().subscribe({
      next: (data) => {
        this.todosLosRegistros = data;
        this.aplicarFiltro(filtroInicial);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error al cargar historial', err);
        this.isLoadingSubject.next(false);
      }
    });
  }

  aplicarFiltro(filtro: string): void {
    if (filtro === 'PLAZO PERSONALIZADO' || filtro === 'TODOS') {
      this.registrosAMostrarSubject.next([...this.todosLosRegistros]);
    } else {
      const filtrados = this.todosLosRegistros.filter(r => r.categoria === filtro);
      this.registrosAMostrarSubject.next(filtrados);
    }
  }
}