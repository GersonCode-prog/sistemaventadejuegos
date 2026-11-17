// ============================================================
//  SESIÓN — usuarios de prueba (sin base de datos)
// ============================================================
import { ruta } from './ruta';

export type Rol = 'Administrador' | 'Vendedor';

export interface Usuario {
  usuario: string;
  nombre: string;
  rol: Rol;
}

// Usuarios permitidos. Las contraseñas están aquí solo porque es una demo sin base de datos.
const USUARIOS: (Usuario & { clave: string })[] = [
  { usuario: 'admin', clave: '12345', nombre: 'Administrador', rol: 'Administrador' },
  { usuario: 'vendedor', clave: '12345', nombre: 'Andrea Vendedora', rol: 'Vendedor' },
];

const CLAVE_SESION = 'gv_sesion';

// "Recordarme" guarda la sesión en localStorage (sobrevive al cerrar el navegador);
// si no, se usa sessionStorage (se borra al cerrar la pestaña).
export function iniciarSesion(usuario: string, clave: string, recordar = false): Usuario | null {
  const encontrado = USUARIOS.find(
    (u) => u.usuario === usuario.trim().toLowerCase() && u.clave === clave,
  );
  if (!encontrado) return null;
  const { clave: _, ...datos } = encontrado;
  (recordar ? localStorage : sessionStorage).setItem(CLAVE_SESION, JSON.stringify(datos));
  return datos;
}

export function usuarioActual(): Usuario | null {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION) ?? localStorage.getItem(CLAVE_SESION);
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_SESION);
  location.replace(ruta('/login'));
}

export const esAdmin = () => usuarioActual()?.rol === 'Administrador';
