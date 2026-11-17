// ============================================================
//  UI — avisos (toasts), confirmaciones y modales
// ============================================================

export function aviso(mensaje: string, tipo: 'exito' | 'error' | 'info' = 'exito') {
  let contenedor = document.getElementById('avisos');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'avisos';
    document.body.appendChild(contenedor);
  }
  const iconos = { exito: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `aviso aviso-${tipo}`;
  el.innerHTML = `<span class="aviso-icono">${iconos[tipo]}</span><span></span>`;
  el.lastElementChild!.textContent = mensaje;
  contenedor.appendChild(el);
  setTimeout(() => el.classList.add('saliendo'), 2800);
  setTimeout(() => el.remove(), 3200);
}

// Confirmación con un <dialog> propio (más bonito que window.confirm)
export function confirmar(titulo: string, mensaje: string, textoBoton = 'Eliminar'): Promise<boolean> {
  return new Promise((resolver) => {
    const dialogo = document.createElement('dialog');
    dialogo.className = 'modal modal-chico';
    dialogo.innerHTML = `
      <div class="modal-cuerpo confirmar">
        <div class="confirmar-icono">!</div>
        <h3></h3>
        <p></p>
        <div class="modal-acciones">
          <button type="button" class="btn btn-secundario" data-r="no">Cancelar</button>
          <button type="button" class="btn btn-peligro" data-r="si"></button>
        </div>
      </div>`;
    dialogo.querySelector('h3')!.textContent = titulo;
    dialogo.querySelector('p')!.textContent = mensaje;
    dialogo.querySelector('[data-r="si"]')!.textContent = textoBoton;
    document.body.appendChild(dialogo);
    const cerrar = (r: boolean) => { dialogo.close(); dialogo.remove(); resolver(r); };
    dialogo.addEventListener('click', (e) => {
      const r = (e.target as HTMLElement).dataset.r;
      if (r) cerrar(r === 'si');
      else if (e.target === dialogo) cerrar(false);
    });
    dialogo.addEventListener('cancel', (e) => { e.preventDefault(); cerrar(false); });
    dialogo.showModal();
  });
}

// Abre/cierra un <dialog> existente y conecta sus botones [data-cerrar]
export function prepararModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement;
  modal.querySelectorAll('[data-cerrar]').forEach((b) => b.addEventListener('click', () => modal.close()));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  return modal;
}

// Lee un formulario como objeto { campo: valor }
export function leerFormulario(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
}

// Llena un formulario con los valores de un objeto
export function llenarFormulario(form: HTMLFormElement, datos: Record<string, unknown>) {
  Object.entries(datos).forEach(([k, v]) => {
    const campo = form.elements.namedItem(k) as HTMLInputElement | null;
    if (campo) campo.value = String(v ?? '');
  });
}
