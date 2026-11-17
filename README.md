# 🎮 GameVault GT — Tienda de cuentas de videojuegos

Sistema web para vender cuentas de videojuegos, hecho con [Astro](https://astro.build).
Por ahora funciona **sin base de datos**: todo se guarda en el navegador (`localStorage`).

🌐 **Demo:** https://gersoncode-prog.github.io/sistemaventadejuegos/

## 🔑 Usuarios de prueba

| Usuario    | Contraseña | Rol           | Permisos                                    |
| :--------- | :--------- | :------------ | :------------------------------------------ |
| `admin`    | `12345`    | Administrador | Todo: crear, editar, eliminar, anular       |
| `vendedor` | `12345`    | Vendedor      | Crear y editar; no puede eliminar ni anular |

## ✨ Módulos

### Tienda pública (sin iniciar sesión)
- **Tienda**: cuentas destacadas, filtro por juego, plataforma, precio, ofertas y orden
- **Detalle de la cuenta**: galería de fotos con visor ampliado, lo que incluye, nivel, rango, región y garantías
- **Solicitudes**: el visitante pide comprar, apartar o hace una pregunta, y le llega al panel

### Panel administrativo
- **Dashboard**: indicadores, ventas de 6 meses, estado del inventario, inventario por juego
- **Cuentas**: inventario con código automático por juego (FN-0001, VL-0002...), ofertas, destacadas y **hasta 4 fotos por cuenta**
  (se comprimen automáticamente; la primera es la portada)
- **Clientes**: con gamertag, búsqueda y número de compras
- **Ventas**: registro, descuentos, **control de entrega** (pendiente/entregada), comprobante imprimible y anulación
- **Solicitudes**: las que llegan de la tienda, con WhatsApp y registro rápido como cliente

> 🔐 Por seguridad, el sistema **no guarda contraseñas de las cuentas vendidas**: la entrega
> de accesos se hace por un canal privado y aquí solo se marca como entregada.

## 🎮 Comandos

| Comando           | Acción                                                          |
| :---------------- | :-------------------------------------------------------------- |
| `npm install`     | Instala las dependencias                                        |
| `npm run dev`     | Servidor local en `http://localhost:4321/sistemaventadejuegos/` |
| `npm run build`   | Compila el sitio en `./dist/`                                   |

## 📁 Estructura

```
src/
├── lib/
│   ├── datos.ts     ← "base de datos" en localStorage + datos de ejemplo
│   ├── juegos.ts    ← lista de juegos, colores, íconos y portadas
│   ├── imagenes.ts  ← compresión de fotos y espacio usado
│   ├── sesion.ts    ← usuarios, login y cierre de sesión
│   ├── ui.ts        ← avisos, confirmaciones y modales
│   └── ruta.ts      ← rutas con el prefijo del sitio
├── layouts/
│   ├── Sitio.astro  ← cabecera y pie de la tienda pública
│   └── Panel.astro  ← menú lateral + protección de sesión
├── pages/           ← tienda, detalle, login, dashboard, cuentas, clientes, ventas, solicitudes
└── styles/global.css
```

Para agregar un juego nuevo, solo agrégalo a la lista `JUEGOS` en `src/lib/juegos.ts`.

Los nombres de los juegos pertenecen a sus respectivos dueños; las portadas son dibujos propios, sin logos oficiales.
