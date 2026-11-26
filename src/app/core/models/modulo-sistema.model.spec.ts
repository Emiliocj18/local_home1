import { IModuloSistemaDto, ModuloSistema } from './modulo-sistema.model';

describe('ModuloSistema', () => {
  const dto: IModuloSistemaDto = {
    id_empresa: '1',
    id_usuario: '10',
    codsis: 'SSS',
    nomsis: 'Seguridad',
    estsis: '1',
    imgsis: 'security',
    accsis: 'seguridad',
    tipsis: '1',
    url: 'http://localhost:4201',
  };

  it('H-T01 mapea codsis/nomsis/imgsis/url', () => {
    const modulo = new ModuloSistema(dto);

    expect(modulo.codigo).toBe('SSS');
    expect(modulo.nombre).toBe('Seguridad');
    expect(modulo.icono).toBe('security');
    expect(modulo.url).toBe('http://localhost:4201');
  });

  it('habilitado es false solo cuando url es null', () => {
    expect(new ModuloSistema({ ...dto, url: null }).habilitado).toBe(false);
    expect(new ModuloSistema(dto).habilitado).toBe(true);
  });
});
