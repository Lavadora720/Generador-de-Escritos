# 🍄 Pétalo — Carta elegante exportable

Genera una imagen en alta resolución de una carta escrita a partir de un archivo JSON.
No necesitas tocar el HTML ni el CSS para cambiar el contenido.

---

## 📁 Estructura del proyecto

```
petalo/
├── index.html              ← Página principal (no editar)
├── petalo.js               ← Lógica que inyecta el JSON en el HTML (no editar)
├── capturar.js             ← Script de exportación con Puppeteer (no editar)
├── capturar.bat            ← Lanzador para Windows (doble clic)
├── contenido.json          ← ✏️  AQUÍ vas tus textos y firma
└── estilos/
    └── petalo-style.css    ← Estilos visuales (no editar salvo diseño)
```

---

## ✏️ Cómo cambiar el texto

Abre `contenido.json` con cualquier editor de texto (Notepad, VS Code, etc.).

```json
{
  "firma": "— tu firma aquí",

  "parrafos": [
    {
      "texto": "Primer párrafo. Puede ser corto.",
      "drop_cap": false
    },
    {
      "texto": "Este párrafo tendrá letra capitular dorada al inicio.",
      "drop_cap": true
    },
    {
      "texto": "Tercer párrafo normal.",
      "drop_cap": false
    }
  ]
}
```

### Reglas del JSON

| Campo      | Qué hace                                                  |
|------------|-----------------------------------------------------------|
| `firma`    | Texto de la firma abajo a la derecha                      |
| `texto`    | Contenido del párrafo. Usa `\n` para salto de línea manual|
| `drop_cap` | `true` = letra capitular dorada al inicio del párrafo     |

**Ejemplo con salto de línea:**
```json
{ "texto": "Primera línea.\nSegunda línea.", "drop_cap": false }
```

---

## 🖥️ Ver en el navegador

> ⚠️ El archivo usa `fetch()` para leer el JSON, así que **no funciona abriendo
> index.html directamente** con doble clic. Necesitas un servidor local.

### Opción rápida con Python (Ubuntu / WSL):
```bash
cd /ruta/a/petalo
python3 -m http.server 8080
```
Luego abre en tu navegador: `http://localhost:8080`

### Opción con Node.js:
```bash
npx serve .
```
Luego abre la URL que te muestra.

---

## 📸 Exportar imagen PNG en alta resolución

La imagen se genera con **Chromium headless** (Puppeteer) a escala ×3, lo que
produce una imagen de aproximadamente **2040 × alto px**.

### Desde Windows (doble clic)
Haz doble clic en `capturar.bat`. Se abre WSL, ejecuta el script y guarda
`escrito-HD.png` en la misma carpeta.

### Desde WSL o Ubuntu directamente
```bash
cd /ruta/a/petalo
node capturar.js
```

---

## ⚙️ Instalación de dependencias (Ubuntu / WSL)

### 1. Instalar Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verificar:
```bash
node -v   # debe mostrar v20.x.x
npm -v    # debe mostrar 10.x.x
```

### 2. Instalar dependencias del sistema para Chromium
```bash
sudo apt-get install -y \
  libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
  libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
  libxrandr2 libgbm1 libasound2
```

### 3. Instalar Puppeteer en la carpeta del proyecto
```bash
cd /ruta/a/petalo
npm install puppeteer
```

Esto descarga automáticamente Chromium (~170 MB la primera vez).

---

## 🔁 Flujo completo de uso

```
1. Editar contenido.json  →  cambiar textos y firma
2. Previsualizar          →  python3 -m http.server 8080  →  localhost:8080
3. Exportar imagen        →  doble clic en capturar.bat  (o node capturar.js)
4. Resultado              →  escrito-HD.png en la misma carpeta
```

---

## 🐛 Problemas comunes

**"Cannot find module 'puppeteer'"**
→ Corre `npm install puppeteer` dentro de la carpeta del proyecto.

**El JSON no carga / texto en rojo**
→ Estás abriendo `index.html` con doble clic. Usa el servidor local (ver arriba).

**Las fuentes se ven distintas en la imagen**
→ `capturar.js` espera a que carguen. Si el problema persiste, aumenta el
   timeout en la línea `setTimeout(r, 800)` a `1500` o más.

**El .bat no encuentra WSL**
→ Asegúrate de tener WSL instalado: abre PowerShell y corre `wsl --install`.
