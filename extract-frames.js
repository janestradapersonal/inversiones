import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import { mkdirSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname);

const videoPath = join(projectRoot, 'scroll_3d', 'caixa_video1.mp4');
const outputDir = join(projectRoot, 'public', 'frames', 'caixa_video1');
const manifestPath = join(outputDir, 'manifest.json');

// Crear carpeta de sortida
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Extraient frames del vídeo...');
console.log('📹 Vídeo:', videoPath);
console.log('📁 Sortida:', outputDir);

try {
  // Extreure frames a 15 fps amb escala màxima de 1920px
  // Nota: cal escapar la coma de min(1920,iw) dins el filtre.
  const cmd = `"${ffmpeg}" -y -i "${videoPath}" -vf "fps=15,scale=min(1920\\,iw):-2" -c:v libwebp -quality 80 "${outputDir}/frame_%04d.webp"`;

  console.log('🔧 Executant:', cmd);

  execSync(cmd, { stdio: 'inherit' });

  const frames = readdirSync(outputDir)
    .filter((name) => /^frame_\d{4}\.webp$/.test(name))
    .sort();

  const frameCount = frames.length;
  if (!frameCount) {
    throw new Error('No s\'han generat frames (frameCount=0)');
  }

  const manifest = {
    basePath: '/frames/caixa_video1',
    pattern: 'frame_%04d.webp',
    pad: 4,
    extension: 'webp',
    frameCount,
  };

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('🧾 Manifest creat:', manifestPath);
  console.log('🖼️ Frames totals:', frameCount);

  console.log('✅ Frames extrets correctament!');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n📝 Prova executar manualment:');
  console.log(`ffmpeg -i "scroll_3d/caixa_video1.mp4" -vf "fps=15,scale=min(1920\\,iw):-2" -c:v libwebp -quality 80 "public/frames/caixa_video1/frame_%04d.webp"`);
}