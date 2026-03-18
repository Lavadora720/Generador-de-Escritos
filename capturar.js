/* =====================================================
   capturar.js
   Levanta un servidor HTTP local temporalmente para
   que el fetch() del JSON funcione, captura la carta
   con Puppeteer y luego cierra el servidor.
   Uso: node capturar.js
   ===================================================== */

const puppeteer = require('puppeteer');
const http      = require('http');
const fs        = require('fs');
const path      = require('path');

/* ── Servidor estático mínimo ───────────────────────── */
function crearServidor(carpeta, puerto) {
  const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
  };

  const servidor = http.createServer((req, res) => {
    const urlLimpia = req.url.split('?')[0];
    const archivo   = path.join(carpeta, urlLimpia === '/' ? 'index.html' : urlLimpia);
    const ext       = path.extname(archivo);

    fs.readFile(archivo, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('No encontrado: ' + urlLimpia);
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(data);
    });
  });

  return new Promise((resolve, reject) => {
    servidor.listen(puerto, '127.0.0.1', () => resolve(servidor));
    servidor.on('error', reject);
  });
}

/* ── Main ───────────────────────────────────────────── */
(async () => {
  const PUERTO  = 49152; // puerto alto para no requerir sudo
  const carpeta = __dirname;

  // 1. Levantar servidor local
  console.log(`Iniciando servidor en http://127.0.0.1:${PUERTO} ...`);
  const servidor = await crearServidor(carpeta, PUERTO);

  // 2. Lanzar Puppeteer
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page    = await browser.newPage();

  // deviceScaleFactor: 3 → imagen ~2040px de ancho
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });

  // 3. Cargar la página desde el servidor local (fetch() funciona correctamente)
  await page.goto(`http://127.0.0.1:${PUERTO}/index.html`, { waitUntil: 'networkidle0' });

  // 4. Esperar fuentes y que el JS inyecte el JSON
  await page.evaluateHandle(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  // 5. Capturar solo el elemento carta
  const carta = await page.$('article.carta');

  if (!carta) {
    console.error('❌ No se encontró <article class="carta"> en el HTML.');
    await browser.close();
    servidor.close();
    process.exit(1);
  }

  const salida = path.resolve(__dirname, 'escrito-HD.png');
  await carta.screenshot({ path: salida });

  // 6. Cerrar todo
  await browser.close();
  servidor.close();

  console.log('✓ Imagen guardada en:', salida);
})();