import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nuevo-diagnostico.component.html',
  styleUrls: ['./nuevo-diagnostico.component.css']
})
export class NuevoDiagnosticoComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';
  
  // Variables para la imagen y el estado del proceso
  imagenUrl: string | ArrayBuffer | null = null;
  estadoAnalisis: 'vacio' | 'analizando' | 'completado' = 'vacio';

  // Objeto para guardar los resultados
  resultado = {
    condicion: '',
    clasificacion: '',
    confianza: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      this.nombreUsuario = JSON.parse(userData).usuario;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('deepL_usuario');
    this.router.navigate(['/login']);
  }

  // Método que se activa al elegir un archivo de la PC
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Usamos FileReader para mostrar la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result as string;
        this.iniciarAnalisisSimulado();
      };
      reader.readAsDataURL(file);
    }
  }

  // Simulación del análisis de la IA
  iniciarAnalisisSimulado() {
    this.estadoAnalisis = 'analizando';
    
    // Temporizador de 3 segundos para simular el procesamiento
    setTimeout(() => {
      this.estadoAnalisis = 'completado';
      this.resultado = {
        condicion: 'Hoja enferma',
        clasificacion: 'Roya Amarilla',
        confianza: '79.4%'
      };
    }, 3000); 
  }
}
