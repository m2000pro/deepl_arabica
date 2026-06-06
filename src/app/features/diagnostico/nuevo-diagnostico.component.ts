import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- 1. Importamos ChangeDetectorRef
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

  resultado = {
    condicion: '',
    clasificacion: '',
    confianza: ''
  };

  constructor(
    private router: Router,
    private diagnosticoService: DiagnosticoService,
    private cdr: ChangeDetectorRef // <-- 2. Inyectamos el actualizador de pantalla
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
        this.cdr.detectChanges(); // Forzamos a que pinte la foto de inmediato
      };
      reader.readAsDataURL(file);

      // 3. Sacamos la llamada a la API fuera del FileReader para que Angular no se congele
      this.analizarConApi(file);
    }
  }

  analizarConApi(archivo: File) {
    this.estadoAnalisis = 'analizando'; 
    this.cdr.detectChanges(); // Avisamos a la pantalla que cambió a "Analizando..."
    
    this.diagnosticoService.analizarImagen(archivo).subscribe({
      next: (respuesta: any) => {
        // 4. Imprimimos la respuesta en la consola (F12) para que veas la magia en vivo
        console.log('¡Respuesta de tu IA en Render!', respuesta); 
        
        this.estadoAnalisis = 'completado'; 
        
        const diagnosticos = respuesta.diagnostico;
        let enfermedadPrincipal = 'Desconocida';
        let porcentajeMaximo = 0;
        let esEnferma = false;

        for (const clave in diagnosticos) {
          if (diagnosticos[clave].porcentaje > porcentajeMaximo) {
            porcentajeMaximo = diagnosticos[clave].porcentaje;
            enfermedadPrincipal = clave;
            esEnferma = diagnosticos[clave].detectado;
          }
        }

        const nombresEnfermedades: { [key: string]: string } = {
          'rust': 'Roya Amarilla',
          'miner': 'Minador de hoja',
          'phoma': 'Mancha de Phoma'
        };

        this.resultado = {
          condicion: esEnferma ? 'Hoja enferma' : 'Aparentemente sana',
          clasificacion: nombresEnfermedades[enfermedadPrincipal] || enfermedadPrincipal,
          confianza: porcentajeMaximo + '%'
        };

        // 5. ¡Le gritamos a Angular que actualice los textos en la tarjeta azul!
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