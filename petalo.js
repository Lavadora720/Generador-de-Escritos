/* =====================================================
   petalo.js
   Lee contenido.json e inyecta el texto y la firma
   en la carta. No tocar salvo para cambiar lógica.
   Para cambiar texto → editar contenido.json
   ===================================================== */

fetch('contenido.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo leer contenido.json');
    return res.json();
  })
  .then(data => {

    /* ── Firma ────────────────────────────────────────── */
    const firmaEl = document.getElementById('firma');
    if (firmaEl) firmaEl.textContent = data.firma || '';

    /* ── Párrafos ─────────────────────────────────────── */
    const contenedorEl = document.getElementById('contenido');
    if (!contenedorEl) return;

    data.parrafos.forEach(parrafo => {
      const p = document.createElement('p');

      // Clases base
      p.classList.add('parrafo');

      // Letra capitular si está marcado en el JSON
      if (parrafo.drop_cap) p.classList.add('drop-cap');

      // Soporte para saltos de línea con \n en el JSON
      const lineas = parrafo.texto.split('\n');
      lineas.forEach((linea, i) => {
        p.appendChild(document.createTextNode(linea));
        if (i < lineas.length - 1) p.appendChild(document.createElement('br'));
      });

      contenedorEl.appendChild(p);
    });

  })
  .catch(err => {
    console.error('Error cargando contenido.json:', err.message);
    document.getElementById('contenido').innerHTML =
      `<p class="parrafo" style="color:red;">
        Error: no se pudo cargar <strong>contenido.json</strong>.<br/>
        Asegúrate de abrir el archivo desde un servidor local (ver README).
      </p>`;
  });
