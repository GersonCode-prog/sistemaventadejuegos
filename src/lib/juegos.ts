// ============================================================
//  CATÁLOGO DE JUEGOS — colores e íconos de cada juego
//  (las portadas se dibujan con CSS, no se usan logos oficiales)
// ============================================================

export interface Juego {
  id: string;
  nombre: string;
  icono: string;
  color1: string;
  color2: string;
}

export const JUEGOS: Juego[] = [
  { id: 'fortnite', nombre: 'Fortnite', icono: '🪂', color1: '#7c5cff', color2: '#19afe1' },
  { id: 'freefire', nombre: 'Free Fire', icono: '🔥', color1: '#ff7a18', color2: '#d61f3c' },
  { id: 'valorant', nombre: 'Valorant', icono: '🎯', color1: '#ff4655', color2: '#1f2433' },
  { id: 'roblox', nombre: 'Roblox', icono: '🧱', color1: '#3d7bff', color2: '#18223b' },
  { id: 'minecraft', nombre: 'Minecraft', icono: '⛏️', color1: '#5b9b32', color2: '#4a3020' },
  { id: 'genshin', nombre: 'Genshin Impact', icono: '✨', color1: '#4fa3ff', color2: '#b98bff' },
  { id: 'lol', nombre: 'League of Legends', icono: '⚔️', color1: '#c89b3c', color2: '#0a1428' },
  { id: 'codm', nombre: 'Call of Duty Mobile', icono: '🎖️', color1: '#6b7f2a', color2: '#151a10' },
  { id: 'clash', nombre: 'Clash Royale', icono: '👑', color1: '#2f7bff', color2: '#e0a400' },
  { id: 'pokemongo', nombre: 'Pokémon GO', icono: '🔴', color1: '#ff5470', color2: '#2a75bb' },
];

export const juegoPorId = (id: string): Juego =>
  JUEGOS.find((j) => j.id === id) ?? { id, nombre: id, icono: '🎮', color1: '#7c5cff', color2: '#1a2036' };

// Portada de la cuenta: degradado del juego, ícono grande y nombre
export function portada(juegoId: string, tamano: 'normal' | 'grande' | 'mini' = 'normal') {
  const j = juegoPorId(juegoId);
  return `<div class="portada portada-${tamano}" style="--c1:${j.color1};--c2:${j.color2}">
    <span class="portada-icono">${j.icono}</span>
    <span class="portada-nombre">${j.nombre}</span>
  </div>`;
}

// Portada de una cuenta: su primera foto si tiene, si no la portada de colores del juego
export function portadaCuenta(c: { juego: string; imagenes?: string[] }, tamano: 'normal' | 'grande' | 'mini' = 'normal') {
  const foto = c.imagenes?.[0];
  if (!foto) return portada(c.juego, tamano);
  const j = juegoPorId(c.juego);
  return `<div class="portada portada-${tamano} con-imagen" style="--c1:${j.color1};--c2:${j.color2}">
    <img src="${foto}" alt="" loading="lazy" />
    ${tamano === 'mini' ? '' : `<span class="chip-juego">${j.icono} ${j.nombre}</span>`}
  </div>`;
}
