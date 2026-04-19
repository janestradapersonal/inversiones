import ffmpeg from 'ffmpeg-static';
import { execSync } from 'child_process';
import { mkdirSync, existsSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function parseDurationSeconds(ffmpegStderr) {
  const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(ffmpegStderr);
  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = Number(m[3]);
  if (![hours, minutes, seconds].every(Number.isFinite)) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

function getVideoDurationSeconds(videoPath) {
  // ffmpeg escribe la duración en stderr y suele salir con código != 0 sin especificar salida.
  const cmd = `"${ffmpeg}" -i "${videoPath}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    return null;
  } catch (err) {
    const stderr = (err?.stderr || '').toString();
    return parseDurationSeconds(stderr);
  }
}

const args = parseArgs(process.argv.slice(2));

const inputRel = typeof args.input === 'string' ? args.input : join('scroll_3d', 'caixa_video1.mp4');
const name = typeof args.name === 'string' ? args.name : 'caixa_video1';
const targetFrames = typeof args.frames === 'string' ? Number(args.frames) : null;
const fpsArg = typeof args.fps === 'string' ? Number(args.fps) : null;
const scaleMax = typeof args.scaleMax === 'string' ? Number(args.scaleMax) : 1920;
const clean = args.clean !== 'false';

const videoPath = join(projectRoot, inputRel);
const outputDir = join(projectRoot, 'public', 'frames', name);
const manifestPath = join(outputDir, 'manifest.json');

// Crear carpeta de sortida
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

if (clean) {
  try {
    const existing = readdirSync(outputDir)
      .filter((file) => /^frame_\d{4}\.webp$/.test(file));
    existing.forEach((file) => {
      unlinkSync(join(outputDir, file));
    });
  } catch {
    // ignore
  }
}

console.log('🎬 Extraient frames del vídeo...');
console.log('📹 Vídeo:', videoPath);
console.log('📁 Sortida:', outputDir);

try {
  let fps = fpsArg;
  if (!Number.isFinite(fps) || fps <= 0) {
    fps = 15;
    if (Number.isFinite(targetFrames) && targetFrames > 0) {
      const durationSec = getVideoDurationSeconds(videoPath);
      if (Number.isFinite(durationSec) && durationSec > 0) {
        fps = targetFrames / durationSec;
      }
    }
  }

  // Extreure frames a fps (calculat) amb escala màxima (scaleMax)
  // Nota: cal escapar la coma de min(scaleMax,iw) dins el filtre.
  const cmd = `"${ffmpeg}" -y -i "${videoPath}" -vf "fps=${fps},scale=min(${scaleMax}\\,iw):-2" -c:v libwebp -quality 80 "${outputDir}/frame_%04d.webp"`;

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
    basePath: `/frames/${name}`,
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