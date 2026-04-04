import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname);

const videoPath = join(projectRoot, 'scroll_3d', 'caixa_video1.mp4');
const outputDir = join(projectRoot, 'public', 'frames');

// Crear carpeta de sortida
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Extraient frames del vídeo...');
console.log('📹 Vídeo:', videoPath);
console.log('📁 Sortida:', outputDir);

try {
  // Extreure frames a 15 fps amb escala màxima de 1920px
  const cmd = `"${ffmpeg}" -i "${videoPath}" -vf "fps=15,scale='min(1920,iw) :-2'" -q:v 2 "${outputDir}/frame_%04d.webp"`;

  console.log('🔧 Executant:', cmd);

  execSync(cmd, { stdio: 'inherit' });

  console.log('✅ Frames extrets correctament!');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n📝 Prova executar manualment:');
  console.log(`ffmpeg -i "scroll_3d/caixa_video1.mp4" -vf "fps=15,scale='min(1920,iw):-2'" -q:v 2 "public/frames/frame_%04d.webp"`);
}