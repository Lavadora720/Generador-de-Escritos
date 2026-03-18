/* =====================================================
   petalo.js
   Lee contenido.json e inyecta todo en la carta:
   ornamentos, divisores, párrafos y firma.
   No tocar salvo para cambiar lógica.
   Para cambiar contenido → editar contenido.json
   ===================================================== */

fetch('contenido.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo leer contenido.json');
    return res.json();
  })
  .then(data => {

    const carta = document.getElementById('carta');
    const contenedorEl = document.getElementById('contenido');
    const firmaWrap = document.querySelector('.firma-wrap');

    /* ── Ornamento superior ───────────────────────────── */
    if (data.ornamento_top) {
      const div = document.createElement('div');
      div.className   = 'ornamento-top';
      div.textContent = data.ornamento_top;
      carta.insertBefore(div, contenedorEl);
    }

    /* ── Divisor superior ─────────────────────────────── */
    if (data.divisor_top) {
      const div = document.createElement('div');
      div.className = 'divider';
      div.innerHTML = `<hr/><span>${data.divisor_top}</span><hr/>`;
      carta.insertBefore(div, contenedorEl);
    }

    /* ── Párrafos ─────────────────────────────────────── */
    if (!contenedorEl) return;

    data.parrafos.forEach(parrafo => {
      const p = document.createElement('p');
      p.classList.add('parrafo');
      if (parrafo.drop_cap) p.classList.add('drop-cap');

      // Soporte para saltos de línea con \n en el JSON
      const lineas = parrafo.texto.split('\n');
      lineas.forEach((linea, i) => {
        p.appendChild(document.createTextNode(linea));
        if (i < lineas.length - 1) p.appendChild(document.createElement('br'));
      });

      contenedorEl.appendChild(p);
    });

    /* ── Divisor inferior ─────────────────────────────── */
    if (data.divisor_bottom) {
      const div = document.createElement('div');
      div.className = 'divider-bottom';
      div.innerHTML = `<hr/><span>${data.divisor_bottom}</span><hr/>`;
      carta.insertBefore(div, firmaWrap);
    }

    /* ── Firma ────────────────────────────────────────── */
    const firmaEl = document.getElementById('firma');
    if (firmaEl) firmaEl.textContent = data.firma || '';

  })
  .catch(err => {
    console.error('Error cargando contenido.json:', err.message);
    document.getElementById('contenido').innerHTML =
      `<p class="parrafo" style="color:red;">
        Error: no se pudo cargar <strong>contenido.json</strong>.<br/>
        Asegúrate de abrir el archivo desde un servidor local (ver README).
      </p>`;
  });