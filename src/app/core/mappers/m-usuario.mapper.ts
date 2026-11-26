import { environment } from 'src/environments/environment';
import { MUsuario } from '@emiliocj18/sigesp-core';
import { UsuarioConectado } from '@core/models/usuario-conectado.model';

// Adapter UsuarioConectado (Nest) -> MUsuario (modelo usado por AppComponent).
export function mapToMUsuario(
  usuario: UsuarioConectado,
  accessToken: string,
): MUsuario {
  const mapped = new MUsuario();
  mapped.nombre = usuario.nombre;
  mapped.apellido = usuario.apellido;
  mapped.id = usuario.idUsuario ?? 0;
  mapped.foto = '';
  mapped.token = accessToken;
  mapped.sistema = environment.sistema;
  mapped.carpeta = environment.carpeta;
  mapped.empresa = {
    id: usuario.tenantId,
    titulo: usuario.empresa,
    periodoFiscal: '',
    finPeriodoFiscal: '',
  };
  mapped.conexionDB = {
    baseDeDatos: usuario.tenantName,
    baseDeDatosHR: '',
    baseDeDatosMig: '',
    // AppComponent lee gestor.nombrebase / gestor.l_usuario.
    gestor: {
      nombrebase: usuario.tenantName,
      l_usuario: usuario.usuario,
    } as unknown as string,
    login: '',
    nombre: usuario.tenantName,
    password: '',
    puerto: '',
    servidor: '',
  };

  return mapped;
}
