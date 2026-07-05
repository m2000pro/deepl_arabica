export interface PrediccionRaw {
  class: string;
  probability: number;
}

export interface ProbabilidadFormat {
  nombre: string;
  porcentaje: string;
  valorRaw: number;
}

export interface ResultadoDiagnostico {
  condicion: string;
  clasificacion: string;
  confianza: string;
  recomendacion: string;
  probabilidades: ProbabilidadFormat[];
  porcentajeMaximoRaw: number;
}

export interface PayloadHistorial {
  usuario_id: number;
  parcela_id: number;
  resultado: string;
  enfermedad: string;
  confianza: number;
}