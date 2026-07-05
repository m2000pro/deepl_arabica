import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PanelAdminViewModel } from '../../viewmodels/panel-admin.viewmodel';
import { UsuarioAdmin } from '../../../domain/models/usuario-admin.model';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.scss']
})
export class PanelAdminComponent implements OnInit, OnDestroy {
  usuarios: UsuarioAdmin[] = [];
  nombreAdmin: string = 'Administrador';
  cargando: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: PanelAdminViewModel,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreAdmin = user.nombre_completo || user.usuario;
    }

    this.viewModel.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.cargando = loading;
        this.cdr.detectChanges();
      });

    this.viewModel.usuarios$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.usuarios = data;
        this.cdr.detectChanges();
      });

    this.viewModel.cargarUsuarios();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cambiarEstado(u: UsuarioAdmin) {
    this.viewModel.cambiarEstado(u);
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/portal-tecnico-acceso']);
  }
}