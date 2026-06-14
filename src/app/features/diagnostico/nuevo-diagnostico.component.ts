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
  archivoSeleccionado: File | null = null; // Variable para controlar el archivo en móviles

  // Objeto principal
  resultado = {
    condicion: '',
    clasificacion: '',
    confianza: ''
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
    this.resultado = { condicion: '', clasificacion: '', confianza: '' };
    this.probabilidades = [];
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file; // Lo guardamos para el botón de analizar en móvil
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenUrl = e.target?.result as string;
        this.cdr.detectChanges(); 
      };
      reader.readAsDataURL(file);

      // Si quieres que el análisis sea automático (en PC), deja esta línea.
      // Si prefieres que el usuario siempre presione un botón, puedes comentarla.
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

        const detallesEnfermedad: { [key: string]: { nombre: string, color: string } } = {
          'rust': { nombre: 'Roya Amarilla', color: '#FF6B6B' },   
          'miner': { nombre: 'Minador de hoja', color: '#FCD53F' }, 
          'phoma': { nombre: 'Mancha de Phoma', color: '#A8D08D' }  
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

        this.resultado = {
          condicion: esEnferma ? 'Hoja enferma' : 'Aparentemente sana',
          clasificacion: detallesEnfermedad[enfermedadPrincipal]?.nombre || enfermedadPrincipal,
          confianza: porcentajeMaximo + '%'
        };

        // --- SECCIÓN DE GUARDADO EN LA BASE DE DATOS ---
        const userData = localStorage.getItem('deepL_usuario');
        if (userData) {
          const user = JSON.parse(userData);
          
          const payloadBD = {
            usuario_id: user.id,
            parcela_id: 1, // Se envía estático temporalmente
            resultado: this.resultado.condicion,
            enfermedad: this.resultado.clasificacion,
            confianza: porcentajeMaximo // Número puro sin símbolo %
          };

          this.diagnosticoService.guardarEnHistorial(payloadBD).subscribe({
            next: () => console.log('💾 ¡Diagnóstico guardado en la BD exitosamente!'),
            error: (err: any) => console.error('Error al guardar en BD:', err)
          });
        }

        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        alert('Error al conectar con la API en Render. Revisa la consola.');
        console.error(err);
        this.descartarImagen(); // Si falla, limpia la pantalla
      }
    });
  }
}