import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminLoginViewModel } from '../../viewmodels/admin-login.viewmodel';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  isLoading: boolean = false;
  adminData = { usuario: '', contrasena: '' };

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: AdminLoginViewModel,
    private router: Router
  ) {}

  ngOnInit() {
    this.viewModel.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    this.viewModel.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorMsg => this.errorMessage = errorMsg || '');

    this.viewModel.adminLoginSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          localStorage.setItem('deepL_usuario', JSON.stringify(res.usuario || { usuario: this.adminData.usuario, rol: 'ADMIN' }));
          this.router.navigate(['/panel-admin']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.viewModel.loginAdmin(this.adminData.usuario, this.adminData.contrasena);
  }
}