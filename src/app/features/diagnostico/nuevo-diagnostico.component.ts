import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DiagnosticoService } from '../../core/services/diagnostico.service'; 

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nuevo-diagnostico.component.html',
  styleUrls: ['./nuevo-diagnostico.component.scss']
})
export class NuevoDiagnosticoComponent implements OnInit {
  nombreUsuario: string = 'ADMIN';
  
  imagenUrl: string | ArrayBuffer | null = null;
  estadoAnalisis: 'vacio' | 'analizando' | 'completado' = 'vacio';
  archivoSeleccionado: File | null = null; // Variable para controlar el archivo en móviles

  // Objeto principal actualizado con la propiedad de recomendación
  resultado = {
    condicion: '',
    clasificacion: '',
    confianza: '',
    recomendacion: ''
  };

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

  // --- FUNCIÓN PARA LIMPIAR LA PANTALLA ---
  descartarImagen() {
    this.imagenUrl = null;
    this.archivoSeleccionado = null;
    this.estadoAnalisis = 'vacio';
    this.resultado = { condicion: '', clasificacion: '', confianza: '', recomendacion: '' };
    this.probabilidades = [];
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file; 
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result as string;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);

      // Iniciamos el análisis automático
      this.analizarConApi(file);
    }
  }

  analizarConApi(archivo: File | null) {
    if (!archivo) return;

    this.estadoAnalisis = 'analizando'; 
    this.probabilidades = []; 
    this.cdr.detectChanges(); 
    
    this.diagnosticoService.analizarImagen(archivo).subscribe({
      next: (respuesta: any) => {
        this.estadoAnalisis = 'completado'; 
        
        const diagnosticos = respuesta.diagnostico;
        let enfermedadPrincipal = 'Desconocida';
        let porcentajeMaximo = 0;
        let esEnferma = false;

        // Diccionario ampliado con recomendaciones agronómicas
        const detallesEnfermedad: { [key: string]: { nombre: string, color: string, recomendacion: string } } = {
          'rust': { 
            nombre: 'Roya Amarilla', 
            color: '#FF6B6B',
            recomendacion: 'Se sugiere aplicar fungicida a base de cobre de inmediato. Poda las ramas muy afectadas para mejorar la ventilación y evitar la propagación por esporas al resto de la parcela.'
          },   
          'miner': { 
            nombre: 'Minador de hoja', 
            color: '#FCD53F',
            recomendacion: 'Aplica insecticidas sistémicos o extractos orgánicos como el aceite de neem. Retira y destruye las hojas con galerías visibles para cortar el ciclo de reproducción de la plaga.'
          }, 
          'phoma': { 
            nombre: 'Mancha de Phoma', 
            color: '#A8D08D',
            recomendacion: 'Regula la sombra y reduce la humedad en el follaje. Aplica fungicidas preventivos antes de las épocas de lluvia y asegúrate de mantener un buen drenaje en el suelo.'
          }  
        };

        for (const clave in diagnosticos) {
          const porc = diagnosticos[clave].porcentaje;
          
          this.probabilidades.push({
            nombre: detallesEnfermedad[clave]?.nombre || clave,
            porcentaje: porc,
            color: detallesEnfermedad[clave]?.color || '#4682B4'
          });

          if (porc > porcentajeMaximo) {
            porcentajeMaximo = porc;
            enfermedadPrincipal = clave;
            esEnferma = diagnosticos[clave].detectado;
          }
        }

        this.probabilidades.sort((a, b) => b.porcentaje - a.porcentaje);

        // Construcción del resultado final
        this.resultado = {
          condicion: esEnferma ? 'Hoja enferma' : 'Aparentemente sana',
          clasificacion: detallesEnfermedad[enfermedadPrincipal]?.nombre || enfermedadPrincipal,
          confianza: porcentajeMaximo + '%',
          // Asigna la recomendación específica o una general si la hoja está sana
          recomendacion: esEnferma 
            ? (detallesEnfermedad[enfermedadPrincipal]?.recomendacion || 'Consulta con un ingeniero agrónomo para un tratamiento específico.')
            : 'Tu cultivo parece estar en óptimas condiciones. Mantén tus buenas prácticas de poda, fertilización y monitoreo constante.'
        };

        // --- SECCIÓN DE GUARDADO EN LA BASE DE DATOS ---
        const userData = localStorage.getItem('deepL_usuario');
        if (userData) {
          const user = JSON.parse(userData);
          
          const payloadBD = {
            usuario_id: user.id,
            parcela_id: 1, 
            resultado: this.resultado.condicion,
            enfermedad: this.resultado.clasificacion,
            confianza: porcentajeMaximo 
          };

          this.diagnosticoService.guardarEnHistorial(payloadBD).subscribe({
            next: () => console.log('💾 ¡Diagnóstico guardado en la BD exitosamente!'),
            error: (err: any) => console.error('Error al guardar en BD:', err)
          });
        }

        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        alert('Error al conectar con la API de diagnóstico. Verifica tu conexión.');
        console.error(err);
        this.descartarImagen(); // Limpia la pantalla en caso de error
      }
    });
  }
}