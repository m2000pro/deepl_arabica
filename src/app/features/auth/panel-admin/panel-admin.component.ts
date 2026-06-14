import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.css']
})
export class PanelAdminComponent implements OnInit {
  usuarios: any[] = [];
  nombreAdmin: string = 'Administrador';
  cargando: boolean = true; // Controla el mensaje de "Cargando..."

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private cdr: ChangeDetectorRef // <--- El actualizador forzado de pantalla
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      const user = JSON.parse(userData);
      this.nombreAdmin = user.nombre_completo || user.usuario;
    }
  }

  cargarUsuarios() {
    this.cargando = true;
    this.adminService.obtenerUsuarios().subscribe({
      next: (data: any) => {
        console.log('¡Datos reales capturados del servidor!', data); // Míralo con F12
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges(); // Forzamos a que dibuje la tabla
      },
      error: (err: any) => {
        console.error('Error silencioso descubierto:', err);
        alert('No se pudo cargar la lista de usuarios. Revisa la consola F12.');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarEstado(u: any) {
    // Definimos el nuevo estado al que queremos cambiar
    const nuevo = u.estado === 'Activo' ? 'Suspendido' : 'Activo';
    
    this.adminService.cambiarEstado(u.id, nuevo).subscribe({
      next: () => {
        this.cargarUsuarios(); // Recarga la tabla si fue exitoso
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al intentar cambiar el estado en la base de datos.');
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/portal-tecnico-acceso']);
  }
}