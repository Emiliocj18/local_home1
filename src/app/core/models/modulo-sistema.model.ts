import { IUsuarioSistema } from '@emiliocj18/sigesp-core';

// DTO de GET /queries/sss/sistemas: el backend agrega la URL resuelta por entorno.
export interface IModuloSistemaDto extends IUsuarioSistema {
  url: string | null;
}

// Modelo local de la tarjeta: solo los cuatro datos que el home necesita.
// No se extiende MUsuarioSistema para no acoplar sigesp-core al SSO.
export class ModuloSistema {
  readonly codigo: string;
  readonly nombre: string;
  readonly icono: string;
  readonly url: string | null;

  constructor(dto: IModuloSistemaDto) {
    this.codigo = dto.codsis;
    this.nombre = dto.nomsis;
    this.icono = dto.imgsis;
    this.url = dto.url ?? null;
  }

  get habilitado(): boolean {
    return this.url !== null;
  }
}
