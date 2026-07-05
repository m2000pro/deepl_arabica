import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DashboardViewModel } from '../viewmodels/dashboard.viewmodel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  nombreUsuario: string = 'ADMIN';

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: DashboardViewModel,
    private router: Router
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrarSesion() {
    this.viewModel.cerrarSesion();
  }
}