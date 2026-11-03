// GitHub Pages solo sirve archivos que existen: al recargar /aprende daba su 404.
// Tras `vite build`, copia index.html a cada ruta (dist/aprende/index.html…) y a 404.html,
// así cualquier dirección carga la web y React Router enseña el apartado que toca.
import { copyFileSync, mkdirSync } from 'node:fs';

const RUTAS = ['por-que-invertir', 'aprende', 'empieza', 'foro', 'scroll-3d'];

for (const ruta of RUTAS) {
  mkdirSync(`dist/${ruta}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${ruta}/index.html`);
}
copyFileSync('dist/index.html', 'dist/404.html');
console.log(`Rutas creadas: ${RUTAS.join(', ')} y 404.html`);
