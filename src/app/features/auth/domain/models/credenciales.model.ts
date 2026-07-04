//entidad para credenciales (lo que maneja la autenticación)
export interface Credenciales {
  usuario: string;
  password: string;
}

//entidad para usuarios
export interface Usuario {
  usuario: string;
  rol?: string;
  [key: string]: any;
}