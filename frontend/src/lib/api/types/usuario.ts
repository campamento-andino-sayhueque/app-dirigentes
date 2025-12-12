import { HateoasCollection, HateoasResource } from './hateoas';

// ============================================
// Usuario Types
// ============================================

export type RolUsuario = 'ADMIN' | 'DIRIGENTE' | 'ACAMPANTE' | 'PADRE';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE' | 'SUSPENDIDO';

export interface UsuarioModel extends HateoasResource {
  id: number;
  firebaseUid?: string;
  email: string;
  nombreMostrar: string;
  urlFoto?: string;
  emailVerificado: boolean;
  roles: RolUsuario[];
  estado: EstadoUsuario;
  fechaCreacion: string;
  ultimoLogin?: string;
  // Datos de perfil
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  localidad?: string;
  grupoSanguineo?: string;
  factorRh?: string;
  perfilCompleto: boolean;
}

export interface UsuariosCollection extends HateoasCollection<UsuarioModel> {
  _embedded?: {
    users: UsuarioModel[];
  };
}

export interface ActualizarPerfilRequest {
  nombreMostrar?: string;
  telefono?: string;
  dni?: string;
  fechaNacimiento?: string;
  direccion?: string;
  localidad?: string;
  grupoSanguineo?: string;
  factorRh?: string;
}

export interface UsuarioEstadisticas {
  totalUsuarios: number;
  totalActivos: number;
  totalInactivos: number;
  totalPendientes: number;
  totalAdmins: number;
  totalDirigentes: number;
  totalAcampantes: number;
  totalPadres: number;
}
