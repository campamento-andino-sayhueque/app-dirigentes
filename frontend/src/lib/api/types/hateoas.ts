/**
 * Tipos base para recursos HATEOAS
 */

/**
 * Representa un link HATEOAS
 */
export interface HateoasLink {
  href: string;
  rel?: string;
  type?: string;
  templated?: boolean;
}

/**
 * Tipo base para recursos HATEOAS
 */
export interface HateoasResource {
  _links?: Record<string, HateoasLink | HateoasLink[]>;
}

/**
 * Colección HATEOAS con embedded resources
 */
export interface HateoasCollection<T> extends HateoasResource {
  _embedded?: Record<string, T[]>;
}

/**
 * Extrae los links de un recurso
 */
export type Links<T extends HateoasResource> = T['_links'];
