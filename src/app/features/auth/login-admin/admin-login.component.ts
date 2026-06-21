import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  errorMessage: string = '';
  isLoading: boolean = false;

  // Solo necesitamos estos dos datos ahora
  adminData = { usuario: '', contrasena: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    const credenciales = {
      usuario: this.adminData.usuario,
      contrasena: this.adminData.contrasena
    };

    this.authService.loginAdmin(credenciales).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        // Guardamos la sesión y al panel
        localStorage.setItem('deepL_usuario', JSON.stringify(res.usuario));
        this.router.navigate(['/panel-admin']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Credenciales incorrectas.';
      }
    });
  }
}