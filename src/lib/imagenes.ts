// ============================================================
//  IMÁGENES — se reducen y comprimen antes de guardarse
//  (el navegador solo tiene ~5 MB para todo el sistema)
// ============================================================

export const MAX_IMAGENES = 4;
const ANCHO_MAXIMO = 960;
const CALIDAD = 0.72;

// Convierte un archivo de imagen en un texto "data:image/jpeg;base64,..." reducido
export function comprimirImagen(archivo: File): Promise<string> {
  return new Promise((resolver, rechazar) => {
    if (!archivo.type.startsWith('image/')) return rechazar(new Error('El archivo no es una imagen'));
    const lector = new FileReader();
    lector.onerror = () => rechazar(new Error('No se pudo leer la imagen'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => rechazar(new Error('No se pudo abrir la imagen'));
      img.onload = () => {
        const escala = Math.min(1, ANCHO_MAXIMO / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#0b0e1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolver(canvas.toDataURL('image/jpeg', CALIDAD));
      };
      img.src = String(lector.result);
    };
    lector.readAsDataURL(archivo);
  });
}

// Tamaño aproximado de una imagen guardada, en KB
export const tamanoKB = (dataUrl: string) => Math.round((dataUrl.length * 3) / 4 / 1024);

// Porcentaje aproximado del espacio del navegador que ya se usa
export function espacioUsado() {
  let caracteres = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    caracteres += k.length + (localStorage.getItem(k)?.length ?? 0);
  }
  const limite = 5 * 1024 * 1024; // ~5 millones de caracteres
  return Math.min(100, Math.round((caracteres / limite) * 100));
}

// Imágenes de ejemplo para los datos de prueba (dibujadas, no son capturas reales)
export function imagenEjemplo(opciones: {
  color1: string; color2: string; icono: string; juego: string; titulo: string; lineas: string[]; tipo: 'perfil' | 'inventario';
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 800, 450);
  g.addColorStop(0, opciones.color1);
  g.addColorStop(1, opciones.color2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 800, 450);
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.fillRect(0, 0, 800, 450);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px Arial';
  ctx.fillText(opciones.juego.toUpperCase(), 40, 55);
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fillText(opciones.tipo === 'perfil' ? 'PERFIL DEL JUGADOR' : 'INVENTARIO', 40, 80);

  if (opciones.tipo === 'perfil') {
    ctx.font = '120px Arial';
    ctx.fillText(opciones.icono, 40, 250);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    // Parte el título en dos líneas si es largo
    const palabras = opciones.titulo.split(' ');
    let linea = '', y = 150;
    palabras.forEach((p) => {
      if (ctx.measureText(linea + p).width > 540) { ctx.fillText(linea.trim(), 220, y); linea = ''; y += 36; }
      linea += p + ' ';
    });
    ctx.fillText(linea.trim(), 220, y);
    ctx.font = '22px Arial';
    opciones.lineas.slice(0, 3).forEach((l, i) => ctx.fillText(l, 220, y + 50 + i * 34));
  } else {
    opciones.lineas.slice(0, 8).forEach((l, i) => {
      const x = 40 + (i % 4) * 185;
      const y = 115 + Math.floor(i / 4) * 150;
      ctx.fillStyle = 'rgba(255,255,255,.12)';
      ctx.fillRect(x, y, 170, 130);
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.strokeRect(x, y, 170, 130);
      ctx.fillStyle = '#fff';
      ctx.font = '44px Arial';
      ctx.fillText(opciones.icono, x + 60, y + 65);
      ctx.font = '14px Arial';
      ctx.fillText(l.slice(0, 20), x + 10, y + 110);
    });
  }
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.font = 'italic 14px Arial';
  ctx.fillText('Imagen de ejemplo', 650, 430);
  return canvas.toDataURL('image/jpeg', 0.7);
}
