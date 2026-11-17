// ============================================================
//  DATOS — todo se guarda en localStorage (sin base de datos)
// ============================================================

export type EstadoCuenta = 'Disponible' | 'Reservada' | 'Vendida';
export type Plataforma = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Móvil' | 'Multiplataforma';

export interface Cuenta {
  id: string;
  codigo: string;          // ej. FN-0001
  juego: string;           // id del juego (ver juegos.ts)
  titulo: string;
  plataforma: Plataforma;
  region: 'LATAM' | 'NA' | 'EU' | 'Global';
  nivel: number;
  rango: string;
  extras: string[];        // skins, personajes, items destacados
  precio: number;
  precioAnterior: number;  // 0 si no está en oferta
  estado: EstadoCuenta;
  destacada: boolean;
  descripcion: string;
  creado: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  gamertag: string;
  telefono: string;
  correo: string;
  nit: string;
  creado: string;
}

export interface Venta {
  id: string;
  folio: string;
  cuentaId: string;
  clienteId: string;
  precio: number;
  descuento: number;
  total: number;
  metodoPago: 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Depósito';
  fecha: string;
  vendedor: string;
  entrega: 'Pendiente' | 'Entregada';
  estado: 'Completada' | 'Anulada';
}

export type EstadoSolicitud = 'Nueva' | 'Contactado' | 'Cerrada';

export interface Solicitud {
  id: string;
  cuentaId: string;
  nombre: string;
  telefono: string;
  correo: string;
  tipo: 'Comprar' | 'Apartar' | 'Pregunta';
  mensaje: string;
  fecha: string;
  estado: EstadoSolicitud;
}

type Colecciones = { cuentas: Cuenta; clientes: Cliente; ventas: Venta; solicitudes: Solicitud };
type NombreColeccion = keyof Colecciones;

const PREFIJO = 'gv_';

// ---------- Lectura y escritura ----------
export function obtener<K extends NombreColeccion>(nombre: K): Colecciones[K][] {
  sembrarSiHaceFalta();
  try {
    return JSON.parse(localStorage.getItem(PREFIJO + nombre) || '[]');
  } catch {
    return [];
  }
}

export function guardar<K extends NombreColeccion>(nombre: K, lista: Colecciones[K][]) {
  localStorage.setItem(PREFIJO + nombre, JSON.stringify(lista));
}

export function buscarPorId<K extends NombreColeccion>(nombre: K, id: string) {
  return obtener(nombre).find((x) => x.id === id);
}

export function insertarOActualizar<K extends NombreColeccion>(nombre: K, item: Colecciones[K]) {
  const lista = obtener(nombre);
  const i = lista.findIndex((x) => x.id === item.id);
  if (i >= 0) lista[i] = item;
  else lista.unshift(item);
  guardar(nombre, lista);
}

export function eliminar<K extends NombreColeccion>(nombre: K, id: string) {
  guardar(nombre, obtener(nombre).filter((x) => x.id !== id));
}

export const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const hoy = () => new Date().toLocaleDateString('en-CA');

// ---------- Formatos ----------
export const formatoQ = (n: number) =>
  'Q ' + n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatoQCorto = (n: number) => 'Q ' + Math.round(n).toLocaleString('es-GT');
export const formatoNumero = (n: number) => n.toLocaleString('es-GT');
export const formatoFecha = (f: string) =>
  new Date(`${f}T12:00:00`).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });

export const escapar = (texto: unknown) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Porcentaje de descuento de una oferta
export const porcentajeOferta = (c: Cuenta) =>
  c.precioAnterior > c.precio ? Math.round((1 - c.precio / c.precioAnterior) * 100) : 0;

// Código automático por juego: FN-0001, FF-0002...
const PREFIJOS: Record<string, string> = {
  fortnite: 'FN', freefire: 'FF', valorant: 'VL', roblox: 'RB', minecraft: 'MC',
  genshin: 'GI', lol: 'LOL', codm: 'COD', clash: 'CR', pokemongo: 'PG',
};
export function siguienteCodigo(juego: string) {
  const pre = PREFIJOS[juego] ?? 'GM';
  const numeros = obtener('cuentas').filter((c) => c.codigo.startsWith(pre + '-')).map((c) => Number(c.codigo.split('-')[1]) || 0);
  return `${pre}-${String(Math.max(0, ...numeros) + 1).padStart(4, '0')}`;
}

export function siguienteFolio() {
  const numeros = obtener('ventas').map((v) => Number(v.folio.replace(/\D/g, '')) || 0);
  return `V-${String(Math.max(0, ...numeros) + 1).padStart(4, '0')}`;
}

// ---------- Datos de ejemplo ----------
function sembrarSiHaceFalta() {
  if (localStorage.getItem(PREFIJO + 'sembrado')) return;
  localStorage.setItem(PREFIJO + 'sembrado', '1');

  const fechaHace = (dias: number) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toLocaleDateString('en-CA');
  };

  let n = 0;
  const c = (juego: string, titulo: string, plataforma: Plataforma, region: Cuenta['region'], nivel: number, rango: string,
    extras: string[], precio: number, precioAnterior: number, estado: EstadoCuenta, destacada: boolean, descripcion: string): Cuenta => ({
    id: nuevoId() + n, codigo: '', juego, titulo, plataforma, region, nivel, rango, extras, precio, precioAnterior,
    estado, destacada, descripcion, creado: fechaHace(30 - n++),
  });

  const cuentas: Cuenta[] = [
    c('fortnite', 'Cuenta OG con skins de temporada 2', 'Multiplataforma', 'Global', 412, 'Campeón',
      ['Renegade Raider', 'Black Knight', 'Pase de batalla T2–T8', '85 skins', '1,200 V-Bucks'], 2800, 3300, 'Disponible', true,
      'Cuenta veterana con skins exclusivas de las primeras temporadas. Correo original incluido y sin baneos.'),
    c('freefire', 'Cuenta nivel 70 con armas evolutivas', 'Móvil', 'LATAM', 70, 'Gran Maestro',
      ['3 armas evolutivas al máximo', '45 trajes', 'Elite Pass completos', '2,300 diamantes'], 950, 0, 'Disponible', true,
      'Cuenta competitiva con armas evolutivas al máximo y rango Gran Maestro esta temporada.'),
    c('valorant', 'Cuenta Inmortal 2 con skins Prime', 'PC', 'LATAM', 186, 'Inmortal 2',
      ['Colección Prime', 'Reaver Vandal', 'Todos los agentes', '3,500 VP'], 1650, 0, 'Disponible', true,
      'Cuenta lista para ranked, con todos los agentes desbloqueados y colección de skins premium.'),
    c('roblox', 'Cuenta con Robux y Limiteds', 'Multiplataforma', 'Global', 0, 'Premium',
      ['12,000 Robux', '4 artículos Limited', 'Korblox', 'Membresía Premium activa'], 1200, 1400, 'Disponible', false,
      'Cuenta antigua (2017) con artículos limitados y Robux disponibles.'),
    c('minecraft', 'Java & Bedrock con capa Migrator', 'PC', 'Global', 0, 'Full acceso',
      ['Java + Bedrock', 'Capa Migrator', 'Nombre de 4 letras'], 450, 0, 'Disponible', false,
      'Cuenta Microsoft con Java y Bedrock, nombre corto y capa Migrator.'),
    c('genshin', 'AR 58 con 5★ limitados', 'Multiplataforma', 'NA', 58, 'AR 58',
      ['Raiden Shogun C2', 'Nahida C1', 'Furina', 'Arma 5★ x3', '14,000 Protogemas'], 1800, 2100, 'Reservada', true,
      'Cuenta endgame con varios personajes limitados y Abismo 36★.'),
    c('lol', 'Cuenta Diamante con 120 campeones', 'PC', 'LATAM', 312, 'Diamante III',
      ['120 campeones', '210 skins', 'Prestigio K/DA', '4 skins Definitivas'], 1300, 0, 'Disponible', false,
      'Cuenta LAN con historial limpio, sin restricciones de chat.'),
    c('codm', 'Cuenta Legendaria con armas míticas', 'Móvil', 'Global', 150, 'Legendario',
      ['2 armas míticas', '18 personajes', 'Pases de batalla T1–T20'], 1100, 0, 'Vendida', false,
      'Cuenta con armas míticas y rango Legendario.'),
    c('clash', 'Cuenta nivel 15 con mazos al máximo', 'Móvil', 'Global', 15, 'Ultimate Champion',
      ['8 evoluciones', '45 cartas nivel 15', 'Torre de rey nivel 15'], 700, 0, 'Vendida', false,
      'Cuenta competitiva con evoluciones desbloqueadas.'),
    c('pokemongo', 'Nivel 46 con shinies y legendarios', 'Móvil', 'Global', 46, 'Nivel 46',
      ['180 shinies', '35 legendarios', '12 Pokémon 100%'], 850, 0, 'Vendida', false,
      'Cuenta con gran colección de shinies y legendarios.'),
    c('fortnite', 'Cuenta casual con 40 skins', 'PlayStation', 'LATAM', 190, 'Platino',
      ['40 skins', 'Pase de batalla actual', '600 V-Bucks'], 600, 750, 'Disponible', false,
      'Cuenta ideal para empezar con buena colección de skins.'),
    c('freefire', 'Cuenta inicial con pase élite', 'Móvil', 'LATAM', 45, 'Diamante',
      ['Pase élite actual', '12 trajes', '500 diamantes'], 300, 0, 'Disponible', false,
      'Cuenta económica con pase élite activo.'),
  ];
  cuentas.forEach((x) => { x.codigo = `${PREFIJOS[x.juego]}-${String(cuentas.filter((y) => y.juego === x.juego).indexOf(x) + 1).padStart(4, '0')}`; });

  const cl = (nombre: string, gamertag: string, telefono: string, correo: string, nit: string): Cliente => ({
    id: nuevoId() + nombre.length, nombre, gamertag, telefono, correo, nit, creado: fechaHace(20),
  });
  const clientes: Cliente[] = [
    cl('Diego Méndez', 'DiegoPro_GT', '5512-3456', 'diego.m@correo.com', 'CF'),
    cl('Valeria Cruz', 'ValeGamer', '4123-7890', 'vale.cruz@correo.com', '2345678-9'),
    cl('Kevin Ortiz', 'xXKevinXx', '3098-1122', 'kevin.o@correo.com', 'CF'),
    cl('Fernanda Ruiz', 'FerUwU', '5876-5432', 'fer.ruiz@correo.com', '4567890-1'),
  ];

  const vendidas = cuentas.filter((x) => x.estado === 'Vendida');
  const ventas: Venta[] = vendidas.map((cuenta, i) => ({
    id: nuevoId() + i,
    folio: `V-${String(i + 1).padStart(4, '0')}`,
    cuentaId: cuenta.id,
    clienteId: clientes[i].id,
    precio: cuenta.precio,
    descuento: i === 0 ? 100 : 0,
    total: cuenta.precio - (i === 0 ? 100 : 0),
    metodoPago: (['Transferencia', 'Tarjeta', 'Depósito'] as const)[i % 3],
    fecha: fechaHace([70, 35, 4][i] ?? 1),
    vendedor: 'Administrador',
    entrega: i === 2 ? 'Pendiente' : 'Entregada',
    estado: 'Completada',
  }));

  const disponibles = cuentas.filter((x) => x.estado === 'Disponible');
  const solicitudes: Solicitud[] = [
    { id: nuevoId() + 'a', cuentaId: disponibles[0].id, nombre: 'Marlon Pérez', telefono: '5566-7788', correo: 'marlon@correo.com',
      tipo: 'Comprar', mensaje: '¿Aceptan transferencia de Banrural?', fecha: fechaHace(0), estado: 'Nueva' },
    { id: nuevoId() + 'b', cuentaId: disponibles[2].id, nombre: 'Sofía Lima', telefono: '4011-2233', correo: '',
      tipo: 'Pregunta', mensaje: '¿La cuenta tiene el correo original?', fecha: fechaHace(2), estado: 'Contactado' },
  ];

  guardar('cuentas', cuentas);
  guardar('clientes', clientes);
  guardar('ventas', ventas);
  guardar('solicitudes', solicitudes);
}

export function restablecerDatos() {
  ['cuentas', 'clientes', 'ventas', 'solicitudes', 'sembrado'].forEach((k) => localStorage.removeItem(PREFIJO + k));
  sembrarSiHaceFalta();
}
