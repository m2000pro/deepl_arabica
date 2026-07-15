import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NuevoDiagnosticoViewModel, EstadoAnalisis } from '../../viewmodels/nuevo-diagnostico.viewmodel';
import { ResultadoDiagnostico } from '../../../domain/models/diagnostico.model';

@Component({
  selector: 'app-nuevo-diagnostico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nuevo-diagnostico.component.html',
  styleUrls: ['./nuevo-diagnostico.component.scss']
})
export class NuevoDiagnosticoComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  nombreUsuario: string = 'ADMIN';
  usuarioId: number = 0;
  imagenUrl: string | ArrayBuffer | null = null;
  archivoSeleccionado: File | null = null; 
  estadoAnalisis: EstadoAnalisis = 'vacio';
  resultado: ResultadoDiagnostico | null = null;

  // 🚀 Nuevas variables para la cámara
  camaraActiva: boolean = false;
  streamDeVideo: MediaStream | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    public viewModel: NuevoDiagnosticoViewModel,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('deepL_usuario');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.nombreUsuario = parsedUser.usuario;
      this.usuarioId = parsedUser.id;
    }

    this.viewModel.estado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(estado => {
        this.estadoAnalisis = estado;
        this.cdr.detectChanges();
      });

    this.viewModel.resultado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.resultado = res;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.detenerCamara(); // 🚀 Apagar cámara al cambiar de vista
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // FLUJO 1: SUBIR IMAGEN DESDE ARCHIVO
  // ==========================================
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);

      this.archivoSeleccionado = file;
      this.viewModel.establecerEstado('vacio');
    }
  }

  // ==========================================
  // FLUJO 2: USAR CÁMARA WEB / CELULAR
  // ==========================================
  async iniciarCamara() {
    try {
      // Priorizamos la cámara trasera (environment) para celulares
      this.streamDeVideo = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      this.videoElement.nativeElement.srcObject = this.streamDeVideo;
      this.camaraActiva = true;
      this.imagenUrl = null;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara. Verifica los permisos de tu navegador.');
    }
  }

  tomarFoto() {
    if (!this.camaraActiva) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    // Ajustar el canvas al tamaño real del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el fotograma actual en el canvas
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Obtener la imagen en Base64
    const fotoBase64 = canvas.toDataURL('image/jpeg', 0.9);
    
    // Asignar variables visuales y detener la cámara
    this.imagenUrl = fotoBase64;
    this.archivoSeleccionado = this.base64ToFile(fotoBase64, 'foto_capturada.jpg');
    this.detenerCamara();
    this.cdr.detectChanges();
  }

  detenerCamara() {
    if (this.streamDeVideo) {
      this.streamDeVideo.getTracks().forEach(track => track.stop());
      this.streamDeVideo = null;
    }
    this.camaraActiva = false;
  }

  // 🚀 Utilidad: Convierte el string Base64 a un objeto File para enviarlo a la IA
  private base64ToFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // ==========================================
  // ACCIONES FINALES
  // ==========================================
  analizar() {
    if (this.archivoSeleccionado && this.imagenUrl) {
      this.viewModel.procesarImagen(this.archivoSeleccionado, this.imagenUrl as string, this.usuarioId);
    }
  }

  descartar() {
    this.imagenUrl = null;
    this.archivoSeleccionado = null;
    this.detenerCamara(); // Por si acaso
    this.viewModel.limpiarResultado();
  }
}