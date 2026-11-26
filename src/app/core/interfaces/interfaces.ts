export interface ConfiguracionDB{
  basededatos: string,
  basededatosrrhh: string,
  basededatosmigracion: string,
  gestor: string,
  login: string,
  nombre: string,
  password: string,
  puerto: string,
  servidor: string
}

export interface UsuarioLogin{
  basededatos: string,
  id_empresa: string,
  l_usuario: string,
  login: string,
  mensaje: string,
  password: string,
  password_usu: string,
  perfiscal: string
  puerto: string
  resultado: string
  servidor: string
  titemp: string,
  token: string,
  id_usuario:string,
  foto:string,
  carpeta: string
}

export interface ModuleTab{
  name: string,
  win: Window,
  href: string
}

// Resultado de abrir un módulo: nueva pestaña, ya estaba abierta o popup bloqueado.
export type ModuleOpenResult = 'opened' | 'focused' | 'blocked';

export interface ModuleTabRoute{
  name: string,
  icon?: string,
  url: string,
  href?: string,
  children?: ModuleTabRoute[]
  externalLink?: boolean
}
