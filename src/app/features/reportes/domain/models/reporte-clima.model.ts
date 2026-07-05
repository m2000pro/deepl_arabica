export interface ReporteClima {
  temperatura: { actual: string; max: string; min: string; promedio: string };
  humedad: { actual: string; promedio: string; lluviaHoy: string; lluviaSemana: string };
  condicion: { viento: string; uv: string; presion: string; alerta: string };
}