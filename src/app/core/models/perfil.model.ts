// Perfil del usuario autenticado (contrato de GET/PUT /queries/sss/perfil).
export interface Perfil {
  idUsuario: number;
  idEmpresa: number;
  idPersonal: number;
  codusu: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string | null;
  telefono: string | null;
  telefonoHabitacion: string;
  fechaNacimiento: string | null;
  foto: string | null;
}

// Solo se envían los campos editables; el backend ignora el resto.
export interface UpdatePerfilPayload {
  telefono?: string;
  email?: string;
}
