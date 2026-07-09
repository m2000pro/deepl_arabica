export interface RegistroHistorial {
  id: number;
  fecha: string;
  diagnostico: string;
  enfermedad: string;
  parcela: string;
  categoria: string;
  confianza?: string;      // El signo '?' significa que es opcional
  recomendacion?: string;  // por si algún registro antiguo no lo tiene
  foto_url?: string;
}