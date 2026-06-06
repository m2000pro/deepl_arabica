import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DiagnosticoService } from '../../core/services/diagnostico.service'; 

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nuevo-diagnostico.component.html',
  styleUrls: ['./nuevo-diagnostico.component.css']
})
export class NuevoDiagnosticoComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';
  
  imagenUrl: string | ArrayBuffer | null = null;
  estadoAnalisis: 'vacio' | 'analizando' | 'completado' = 'vacio';

  // Objeto principal
  resultado = {
    condicion: '',
    clasificacion: '',
    confianza: ''
  };

  // NUEVO: Arreglo para las barras de progreso
  probabilidades: any[] = [];

  constructor(
    private router: Router,
    private diagnosticoService: DiagnosticoService,
    private cdr: ChangeDetectorRef 
  ) {}

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result as string;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);

      this.analizarConApi(file);
    }
  }

  analizarConApi(archivo: File) {
    this.estadoAnalisis = 'analizando'; 
    this.probabilidades = []; // Limpiamos barras anteriores
    this.cdr.detectChanges(); 
    
    this.diagnosticoService.analizarImagen(archivo).subscribe({
      next: (respuesta: any) => {
        this.estadoAnalisis = 'completado'; 
        
        const diagnosticos = respuesta.diagnostico;
        let enfermedadPrincipal = 'Desconocida';
        let porcentajeMaximo = 0;
        let esEnferma = false;

        // Diccionario con nombres en español y colores para las barras
        const detallesEnfermedad: { [key: string]: { nombre: string, color: string } } = {
          'rust': { nombre: 'Roya Amarilla', color: '#FF6B6B' },   // Rojo/Naranja
          'miner': { nombre: 'Minador de hoja', color: '#FCD53F' }, // Amarillo
          'phoma': { nombre: 'Mancha de Phoma', color: '#A8D08D' }  // Verde claro
        };

        for (const clave in diagnosticos) {
          const porc = diagnosticos[clave].porcentaje;
          
          // Llenamos el arreglo para las barras
          this.probabilidades.push({
            nombre: detallesEnfermedad[clave]?.nombre || clave,
            porcentaje: porc,
            color: detallesEnfermedad[clave]?.color || '#4682B4'
          });

          // Calculamos el mayor para el resultado principal
          if (porc > porcentajeMaximo) {
            porcentajeMaximo = porc;
            enfermedadPrincipal = clave;
            esEnferma = diagnosticos[clave].detectado;
          }
        }

        // Ordenamos las barras de mayor a menor porcentaje visualmente
        this.probabilidades.sort((a, b) => b.porcentaje - a.porcentaje);

        this.resultado = {
          condicion: esEnferma ? 'Hoja enferma' : 'Aparentemente sana',
          clasificacion: detallesEnfermedad[enfermedadPrincipal]?.nombre || enfermedadPrincipal,
          confianza: porcentajeMaximo + '%'
        };

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        alert('Error al conectar con la API en Render. Revisa la consola.');
        console.error(err);
        this.estadoAnalisis = 'vacio';
        this.imagenUrl = null;
        this.cdr.detectChanges();
      }
    });
  }
}