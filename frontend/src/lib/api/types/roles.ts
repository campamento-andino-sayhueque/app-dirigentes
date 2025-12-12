import { HateoasCollection, HateoasResource } from './hateoas';

// ============================================
// Roles Types
// ============================================

export interface RolModel extends HateoasResource {
  nombre: string;
  descripcion: string;
}

export interface RolesCollection extends HateoasCollection<RolModel> {
  _embedded?: {
    rolModelList: RolModel[];
  };
}
