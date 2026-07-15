import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DashboardViewModel } from '../dashboard/presentation/viewmodels/dashboard.viewmodel';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {
  
  usuario = {
    nombre: 'Cargando...',
    iniciales: '',
    rol: 'Usuario',
    nombreUsuario: '---' // Nueva variable para el usuario
  };

  private destroy$ = new Subject<void>();

  constructor(private viewModel: DashboardViewModel) {}

  ngOnInit() {
    this.viewModel.nombreUsuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe(nombre => {
        if (nombre) {
          this.usuario.nombre = nombre;
          this.usuario.iniciales = nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
      });

    // Leemos el usuario directamente de la sesión guardada
    try {
      const sesionGuardada = localStorage.getItem('deepL_usuario');
      if (sesionGuardada) {
        const datosParseados = JSON.parse(sesionGuardada);
        this.usuario.nombreUsuario = datosParseados.usuario || 'Desconocido';
      }
    } catch (error) {
      console.error("Error leyendo datos:", error);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}