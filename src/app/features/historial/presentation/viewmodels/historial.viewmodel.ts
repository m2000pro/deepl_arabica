import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HistorialRepository } from '../../domain/repositories/historial.repository';
import { RegistroHistorial } from '../../domain/models/registro-historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialViewModel {
  private todosLosRegistros: RegistroHistorial[] = [];

  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private registrosAMostrarSubject = new BehaviorSubject<RegistroHistorial[]>([]);
  public registrosAMostrar$ = this.registrosAMostrarSubject.asObservable();

  // Variables para el Modal de Detalles
  public modalAbierto = false;
  public registroSeleccionado: any = null;
  public modoEdicion = false;
  public parcelaTemporal = '';

  constructor(private historialRepo: HistorialRepository) {}

  // AHORA RECIBE EL ID DIRECTAMENTE DEL COMPONENTE
  cargarHistorial(usuarioId: number, filtroInicial: string = 'TODOS'): void {
    this.isLoadingSubject.next(true);
    
    // Si el ID no es válido, detenemos la carga por seguridad
    if (!usuarioId || usuarioId === 0) {
      console.warn('ID de usuario inválido. No se puede cargar el historial.');
      this.isLoadingSubject.next(false);
      return;
    }

    this.historialRepo.obtenerRegistros(usuarioId).subscribe({
      next: (data) => {
        this.todosLosRegistros = data;
        this.aplicarFiltro(filtroInicial);
        this.isLoadingSubject.next(false);
      },
      error: (err) => {
        console.error('Error al cargar historial desde TiDB', err);
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

  // --- MÉTODOS DEL MODAL Y EDICIÓN ---
  abrirDetalles(registro: any) {
    this.registroSeleccionado = registro;
    this.parcelaTemporal = registro.parcela || '';
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.registroSeleccionado = null;
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarParcela() {
    if (!this.registroSeleccionado) return;
    
    this.historialRepo.actualizarParcela(this.registroSeleccionado.id, this.parcelaTemporal).subscribe({
      next: () => {
        // Actualizamos visualmente sin recargar la base de datos
        this.registroSeleccionado.parcela = this.parcelaTemporal;
        this.modoEdicion = false;
        // Refrescamos la tabla
        this.registrosAMostrarSubject.next([...this.todosLosRegistros]); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar la parcela en la base de datos.');
      }
    });
  }
}