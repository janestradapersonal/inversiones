import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Historia de «Por qué invertir» en 3D, controlada por el scroll.
// Dos flechas (motivo 1: el euro, motivo 2: las pensiones) entran por los lados y vuelan hacia un globo (motivo 3: la deuda).
// El tiempo de la historia T va de 0 a 3: cada escena de la página ([data-escena="0|1|2"]) avanza una unidad.
//   0 → 1   título, la cámara entra en la flecha 1
//   1 → 2   sale, las flechas se acercan, entra en la flecha 2
//   2 → 3   sale, las flechas pinchan el globo, revienta y se llena todo de billetes, facturas y monedas
// Flechas, globo y cámara dependen solo de T (funciona igual subiendo que bajando).
// El reventón va en tiempo real desde que T pasa el momento del pinchazo, como un globo de verdad;
// si se vuelve a subir, el globo aparece entero otra vez.

export const COLORES = { euro: "#4DA8FF", pensiones: "#FFC83D", deuda: "#FF4D6D", fondo: "#01010D" };

// --- Almacén mínimo para que los textos de cada escena lean T sin re-renderizar la página entera
const store = { T: 0, subs: new Set() };
const fijarT = (t) => {
  if (Math.abs(t - store.T) < 1e-4) return;
  store.T = t;
  store.subs.forEach((f) => f());
};
export function useT() {
  return useSyncExternalStore(
    (f) => {
      store.subs.add(f);
      return () => store.subs.delete(f);
    },
    () => store.T,
    () => 0
  );
}

// --- Utilidades
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const tramo = (x, a, b) => clamp((x - a) / (b - a));
const suave = (x) => x * x * (3 - 2 * x);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const V2 = (x, y) => new THREE.Vector2(x, y);

const T_GOLPE = 2.7; // las flechas tocan el globo (con margen tras salir de la flecha 2 para verlas llegar)
const radioGlobo = (T) => 1.5 + 0.16 * Math.min(T, T_GOLPE); // la deuda no para de crecer
const ESTIRA = 1.12; // el globo es algo más alto que ancho
const DURA_RASGO = 0.45; // segundos que tarda el látex en abrirse (antes 0,13: no daba tiempo a verlo)

// Las flechas entran por los lados de la pantalla (izquierda y derecha) y vuelan hacia el globo con un ligero arco
let mediaVista = 11; // media anchura visible del plano general a la altura del globo (se recalcula al cambiar el tamaño)
const LADOS = [V(-1, 0.2, 0.16), V(1, 0.05, -0.1)];
const ARCO = [1.4, 0.9];
const metas = LADOS.map((d) => {
  const n = d.clone().normalize();
  const R = radioGlobo(T_GOLPE);
  return V(n.x * R, n.y * R * ESTIRA, n.z * R);
});
const salida = (k) => {
  const x = Math.max(6.5, mediaVista * 0.9);
  return k === 0 ? V(-x, 0.1, 0.7) : V(x, -0.2, -0.5);
};
function trayecto(k, s) {
  const p = salida(k).lerp(metas[k], s);
  p.y += ARCO[k] * Math.sin(Math.PI * s);
  return p;
}

function flecha(k, T) {
  const s = Math.pow(clamp(T / T_GOLPE), 1.2);
  const s0 = Math.min(s, 0.998);
  const dir = trayecto(k, s0 + 0.002).sub(trayecto(k, s0)).normalize();
  const punta = trayecto(k, s);
  if (T > T_GOLPE) punta.addScaledVector(dir, (T - T_GOLPE) * 4);
  const cabeza = punta.clone().addScaledVector(dir, -0.6);
  return { punta, dir, cabeza };
}

function planoGeneral(T, zs) {
  const y = 0.5 + 0.4 * (1 - suave(clamp(T / T_GOLPE)));
  return { pos: V(0, y + 1.5, 19 * zs), mira: V(0, y, 0), fov: 38 };
}

function dentroDe(k, T, zs) {
  const g = planoGeneral(T, zs);
  const { cabeza } = flecha(k, T);
  const n = g.pos.clone().sub(cabeza).normalize();
  return { pos: cabeza.clone().addScaledVector(n, 0.62), mira: cabeza, fov: 26 };
}

// La mirada llega antes que la cámara, para que lo que vamos a atravesar quede centrado
function mezcla(a, b, e) {
  const m = suave(Math.min(1, e * 1.8));
  return { pos: a.pos.clone().lerp(b.pos, e), mira: a.mira.clone().lerp(b.mira, m), fov: a.fov + (b.fov - a.fov) * e };
}

function camara(T, zs) {
  const g = planoGeneral(T, zs);
  if (T < 0.2) return g;
  if (T < 1) return mezcla(g, dentroDe(0, T, zs), suave(tramo(T, 0.2, 1)));
  if (T < 1.4) return mezcla(dentroDe(0, T, zs), g, suave(tramo(T, 1, 1.4)));
  if (T < 1.5) return g;
  if (T < 2) return mezcla(g, dentroDe(1, T, zs), suave(tramo(T, 1.5, 2)));
  // Al salir de la flecha 2: plano amplio con las dos flechas acercándose por los lados y un avance lento hacia el globo
  const cerca = { pos: V(0, 1.6, 12.5 * zs), mira: V(0, 0.45, 0), fov: 40 };
  const encima = { pos: V(0, 1.2, 9.5 * zs), mira: V(0, 0.3, 0), fov: 40 };
  if (T < 2.3) return mezcla(dentroDe(1, T, zs), cerca, suave(tramo(T, 2, 2.3)));
  if (T < T_GOLPE) return mezcla(cerca, encima, suave(tramo(T, 2.3, T_GOLPE)));
  const dentro = { pos: V(0, 0.4, 2.2), mira: V(0, 0, -2), fov: 60 };
  return mezcla(encima, dentro, suave(tramo(T, T_GOLPE + 0.08, 3)));
}

// Capa de color que llena la pantalla al entrar en una flecha / al reventar el globo
function capa(T) {
  if (T < 1) return { color: COLORES.euro, o: tramo(T, 0.86, 0.99) };
  if (T < 1.5) return { color: COLORES.euro, o: 1 - tramo(T, 1.01, 1.14) };
  if (T < 2) return { color: COLORES.pensiones, o: tramo(T, 1.86, 1.99) };
  if (T < 2.5) return { color: COLORES.pensiones, o: 1 - tramo(T, 2.01, 2.14) };
  return { color: COLORES.deuda, o: tramo(T, 2.9, 2.99) };
}

// Números pseudoaleatorios repetibles
function azar(semilla) {
  let s = semilla;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// --- Texturas dibujadas en canvas
function lienzo(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}
function aTextura(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function texturaTexto(lineas, { ancho = 512, alto = 256, color = "#fff", tam = 90 } = {}) {
  const [c, g] = lienzo(ancho, alto);
  g.textAlign = "center";
  g.textBaseline = "middle";
  lineas.forEach((l, i) => {
    g.font = `${l.peso || 800} ${l.tam || tam}px "Anton", "Impact", sans-serif`;
    g.fillStyle = l.color || color;
    g.fillText(l.t, ancho / 2, alto / 2 + (i - (lineas.length - 1) / 2) * (l.tam || tam) * 1.05);
  });
  return aTextura(c);
}

// Estela de luz detrás de cada flecha: brillante junto a las plumas y se apaga hacia atrás
function texturaEstela() {
  const [c, g] = lienzo(8, 256);
  const d = g.createLinearGradient(0, 0, 0, 256);
  d.addColorStop(0, "rgba(255,255,255,0)");
  d.addColorStop(0.7, "rgba(255,255,255,0.35)");
  d.addColorStop(1, "rgba(255,255,255,0.9)");
  g.fillStyle = d;
  g.fillRect(0, 0, 8, 256);
  return aTextura(c);
}

// Billete de 100 € estilizado (no es una reproducción del real)
function texturaBillete() {
  const [c, g] = lienzo(512, 280);
  const r = azar(55);
  const fondo = g.createLinearGradient(0, 0, 512, 280);
  fondo.addColorStop(0, "#7FA56C");
  fondo.addColorStop(0.45, "#B4CC93");
  fondo.addColorStop(1, "#6F9560");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 512, 280);
  // líneas finas de seguridad
  g.lineWidth = 0.8;
  for (let k = 0; k < 40; k++) {
    g.strokeStyle = `rgba(255,255,240,${0.1 + r() * 0.12})`;
    g.beginPath();
    for (let x = 0; x <= 512; x += 6) g.lineTo(x, 20 + k * 6.2 + Math.sin(x * 0.03 + k * 0.7) * 9);
    g.stroke();
  }
  // ventana y arcos (motivo arquitectónico)
  g.strokeStyle = "rgba(40,80,40,0.55)";
  g.lineWidth = 3;
  for (let k = 0; k < 3; k++) {
    g.beginPath();
    g.arc(250, 150, 70 - k * 14, Math.PI, 0);
    g.lineTo(320 - k * 14, 240);
    g.moveTo(180 + k * 14, 150);
    g.lineTo(180 + k * 14, 240);
    g.stroke();
  }
  // estrellas en círculo
  g.fillStyle = "rgba(255,226,120,0.85)";
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    g.beginPath();
    g.arc(110 + Math.cos(a) * 34, 175 + Math.sin(a) * 34, 3.2, 0, Math.PI * 2);
    g.fill();
  }
  // banda holográfica
  const holo = g.createLinearGradient(410, 0, 450, 280);
  holo.addColorStop(0, "#D9DEE6");
  holo.addColorStop(0.3, "#F4E6FF");
  holo.addColorStop(0.6, "#C8F1E4");
  holo.addColorStop(1, "#E3E6EA");
  g.fillStyle = holo;
  g.fillRect(410, 0, 38, 280);
  // cifras
  g.fillStyle = "#2F5A2B";
  g.font = '900 96px "Anton", Impact, sans-serif';
  g.textBaseline = "top";
  g.fillText("100", 24, 18);
  g.font = '900 34px "Anton", Impact, sans-serif';
  g.fillText("100", 455, 230);
  g.fillText("EURO", 230, 26);
  g.strokeStyle = "rgba(30,60,30,0.6)";
  g.lineWidth = 4;
  g.strokeRect(4, 4, 504, 272);
  return aTextura(c);
}

function texturaFactura() {
  const [c, g] = lienzo(256, 360);
  const r = azar(77);
  g.fillStyle = "#F6F2E8";
  g.fillRect(0, 0, 256, 360);
  g.fillStyle = "#E0475F";
  g.fillRect(0, 0, 256, 56);
  g.fillStyle = "#fff";
  g.font = '800 30px "Anton", Impact, sans-serif';
  g.textAlign = "center";
  g.fillText("INTERESES", 128, 40);
  g.textAlign = "left";
  g.fillStyle = "#8F897C";
  for (let i = 0; i < 9; i++) {
    g.fillRect(20, 80 + i * 22, 70 + r() * 70, 6);
    g.fillRect(190, 80 + i * 22, 40, 6);
  }
  g.fillStyle = "#2B2B2B";
  g.fillRect(20, 290, 216, 2);
  g.font = '800 26px "Anton", Impact, sans-serif';
  g.fillText("TOTAL", 20, 324);
  g.textAlign = "right";
  g.fillStyle = "#E0475F";
  g.fillText("-40.432 M€", 236, 324);
  // sello
  g.save();
  g.translate(150, 200);
  g.rotate(-0.35);
  g.strokeStyle = "rgba(224,71,95,0.7)";
  g.lineWidth = 5;
  g.strokeRect(-70, -26, 140, 52);
  g.fillStyle = "rgba(224,71,95,0.7)";
  g.textAlign = "center";
  g.font = '900 34px "Anton", Impact, sans-serif';
  g.fillText("A PAGAR", 0, 12);
  g.restore();
  return aTextura(c);
}

// El globo impreso: color de la deuda con «3 DEUDA» delante
function texturaGlobo() {
  const [c, g] = lienzo(2048, 1024);
  g.fillStyle = "#D8203F"; // látex rojo (con la luz se ve como el color de la deuda)
  g.fillRect(0, 0, 2048, 1024);
  g.fillStyle = "rgba(255,255,255,0.94)";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = '900 190px "Anton", Impact, sans-serif';
  g.fillText("3", 1024, 360);
  g.font = '900 130px "Anton", Impact, sans-serif';
  g.fillText("DEUDA", 1024, 530);
  return aTextura(c);
}

function texturaNiebla() {
  const [c, g] = lienzo(128, 128);
  const d = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  d.addColorStop(0, "rgba(255,255,255,0.9)");
  d.addColorStop(0.4, "rgba(255,255,255,0.35)");
  d.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = d;
  g.fillRect(0, 0, 128, 128);
  return aTextura(c);
}

// --- Flecha estilizada: punta facetada de acero, asta gruesa lacada y brillante del color del motivo,
// plumas grandes en flecha, culatín y una estela de luz. La punta está en el origen y la flecha sube por +Y.
function geoPluma() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.12, 0.5, 0.5, 0.55);
  s.lineTo(1.0, 0.48);
  s.lineTo(0.92, 0);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.014, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.01, bevelSegments: 2, curveSegments: 16 });
  geo.translate(0, 0, -0.007);
  geo.rotateZ(Math.PI / 2); // largo → +Y, ancho → -X
  geo.translate(-0.095, 0, 0); // pegada al asta
  return geo;
}

function crearFlecha(color) {
  const grupo = new THREE.Group();
  const c = new THREE.Color(color);
  const acero = new THREE.MeshPhysicalMaterial({ color: "#EEF1F6", metalness: 1, roughness: 0.12, clearcoat: 1, flatShading: true });
  const lacada = new THREE.MeshPhysicalMaterial({ color, emissive: c, emissiveIntensity: 0.3, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 });
  const oscuro = new THREE.MeshPhysicalMaterial({ color: "#14121E", roughness: 0.25, clearcoat: 1 });
  const blanco = new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", emissive: "#FFFFFF", emissiveIntensity: 0.12, roughness: 0.3, clearcoat: 0.8 });

  // Punta: pirámide de cuatro caras, alargada y afilada
  const punta = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.95, 4, 1), acero);
  punta.rotation.x = Math.PI;
  punta.position.y = 0.475;
  grupo.add(punta);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.18, 24), oscuro);
  collar.position.y = 1.02;
  grupo.add(collar);

  // Asta
  const asta = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.0, 28), lacada);
  asta.position.y = 1.1 + 1.5;
  grupo.add(asta);
  [2.95, 3.12].forEach((y) => {
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.08, 28), blanco);
    a.position.y = y;
    grupo.add(a);
  });

  // Plumas: la guía en blanco y las otras dos del color del motivo
  const geo = geoPluma();
  const matsPluma = [
    new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", emissive: "#FFFFFF", emissiveIntensity: 0.25, roughness: 0.45, clearcoat: 0.4, side: THREE.DoubleSide }),
    new THREE.MeshPhysicalMaterial({ color, emissive: c, emissiveIntensity: 0.4, roughness: 0.4, clearcoat: 0.4, side: THREE.DoubleSide }),
  ];
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(geo, matsPluma[i === 0 ? 0 : 1]);
    p.rotation.y = (i * Math.PI * 2) / 3;
    p.position.y = 3.2;
    grupo.add(p);
  }

  // Culatín
  const culatin = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.22, 24), oscuro);
  culatin.position.y = 4.21;
  grupo.add(culatin);

  // Estela de luz (aditiva) y un punto de luz del color de la flecha que la ilumina a ella y al globo
  const estela = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.22, 7, 24, 1, true),
    new THREE.MeshBasicMaterial({ color, map: texturaEstela(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
  );
  estela.position.y = 4.3 + 3.5;
  grupo.add(estela);
  const luz = new THREE.PointLight(color, 9, 6, 1.6);
  luz.position.y = 0.6;
  grupo.add(luz);

  grupo.scale.setScalar(1.3);
  return grupo;
}

// --- Globo de látex: forma de lágrima (más estrecho hacia el nudo)
function geoGlobo() {
  const pts = [V2(0, -ESTIRA * 1.1)];
  for (let i = 1; i <= 72; i++) {
    const a = -Math.PI / 2 + (i / 72) * Math.PI;
    let x = Math.cos(a);
    let y = Math.sin(a) * ESTIRA;
    if (a < 0) {
      const b = Math.pow(-Math.sin(a), 2.4);
      x *= 1 - 0.32 * b;
      y *= 1.1;
    }
    pts.push(V2(Math.max(0, x), y));
  }
  return new THREE.LatheGeometry(pts, 112, Math.PI);
}

// Rasga el látex: descarta lo que está a menos de uRasgo radianes del pinchazo, con borde irregular
function rasgable(mat) {
  const u = { uDir: { value: V(0, 1, 0) }, uDir2: { value: V(0, 1, 0) }, uRasgo: { value: 0 } };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = "varying vec3 vObj;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
    sh.fragmentShader =
      "varying vec3 vObj;\nuniform vec3 uDir;\nuniform vec3 uDir2;\nuniform float uRasgo;\n" +
      sh.fragmentShader.replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
        if (uRasgo > 0.0) {
          vec3 d = normalize(vObj);
          float a = min(acos(clamp(dot(d, uDir), -1.0, 1.0)), acos(clamp(dot(d, uDir2), -1.0, 1.0)));
          float jag = sin(d.x * 37.0) * sin(d.y * 29.0 + 2.0) * sin(d.z * 41.0 + 1.0) * 0.22
                    + sin(atan(d.z, d.x) * 19.0 + d.y * 9.0) * 0.09;
          if (a < uRasgo + jag * min(1.0, uRasgo * 3.0)) discard;
        }`
      );
  };
  return u;
}

// Paleteo del papel en el aire (se dobla y ondula cada uno a su ritmo)
function papel(mat, uTiempo, amp) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTiempo = uTiempo;
    sh.vertexShader =
      "attribute float aFase;\nuniform float uTiempo;\n" +
      sh.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        transformed.z += sin(position.x * 11.0 + uTiempo * 6.0 + aFase * 3.0) * ${amp.toFixed(3)}
          + position.x * position.x * 2.4 * sin(aFase + uTiempo * 1.7)
          + position.y * position.y * 1.4 * cos(aFase * 1.3 + uTiempo * 1.3);`
      );
  };
}

// Movimiento con rozamiento del aire: sale disparado y acaba cayendo a su velocidad límite
function vuelo(d, tau, out) {
  const e = (1 - Math.exp(-d.c * tau)) / d.c;
  out.copy(d.p0).addScaledVector(d.v0, e);
  out.y -= d.vt * (tau - e);
  const a = clamp(tau * 1.5) * d.A;
  out.x += a * Math.sin(d.w * tau + d.f);
  out.z += a * Math.cos(d.w * 0.8 * tau + d.f);
  return e;
}

export default function HistoriaFlechas() {
  const montaje = useRef(null);
  const capaRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    const el = montaje.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const escena = new THREE.Scene();
    escena.background = new THREE.Color(COLORES.fondo);
    escena.fog = new THREE.Fog("#0C0838", 20, 48);
    // Reflejos de un estudio: el acero, el látex y las monedas brillan de verdad
    const pmrem = new THREE.PMREMGenerator(renderer);
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    escena.environment = entorno;
    escena.environmentIntensity = 0.55;
    const cam = new THREE.PerspectiveCamera(38, 1, 0.05, 100);

    // Cielo con degradado (índigo arriba, casi negro abajo) y halo rojizo detrás del globo
    const cielo = new THREE.Mesh(
      new THREE.SphereGeometry(70, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { arriba: { value: new THREE.Color("#2A1680") }, medio: { value: new THREE.Color("#0C0838") }, abajo: { value: new THREE.Color(COLORES.fondo) } },
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader:
          "uniform vec3 arriba; uniform vec3 medio; uniform vec3 abajo; varying vec3 vP;" +
          "void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(medio, arriba, smoothstep(0.0, 0.6, h)) : mix(medio, abajo, smoothstep(0.0, 0.35, -h)); gl_FragColor = vec4(c, 1.0); }",
      })
    );
    escena.add(cielo);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texturaNiebla(), color: COLORES.deuda, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })
    );
    halo.scale.set(11, 11, 1);
    halo.position.set(0, 0.2, -3.5);
    escena.add(halo);

    // Luces
    escena.add(new THREE.HemisphereLight("#C9CFFF", "#1A1040", 0.6));
    const sol = new THREE.DirectionalLight("#ffffff", 2.4);
    sol.position.set(6, 12, 9);
    escena.add(sol);
    const contra = new THREE.PointLight("#6331FB", 60, 30);
    contra.position.set(-4, 3, -6);
    escena.add(contra);
    const calida = new THREE.PointLight("#FF5C7A", 22, 20);
    calida.position.set(4, -2, 4);
    escena.add(calida);

    // Polvo de fondo
    const r = azar(7);
    const pts = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      pts[i * 3] = (r() - 0.5) * 60;
      pts[i * 3 + 1] = (r() - 0.5) * 40 + 4;
      pts[i * 3 + 2] = -r() * 30 + 4;
    }
    const geoPolvo = new THREE.BufferGeometry();
    geoPolvo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    const polvo = new THREE.Points(geoPolvo, new THREE.PointsMaterial({ color: "#8E86FF", size: 0.06, transparent: true, opacity: 0.55 }));
    escena.add(polvo);

    // Flechas con su rótulo
    const flechas = [COLORES.euro, COLORES.pensiones].map((c, k) => {
      const f = crearFlecha(c);
      escena.add(f);
      return f;
    });
    const rotulos = [
      ["1", "EL EURO", COLORES.euro],
      ["2", "PENSIONES", COLORES.pensiones],
    ].map(([n, t, c]) => {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texturaTexto([{ t: n, tam: 120, color: c }, { t, tam: 64 }], { alto: 300 }),
          transparent: true,
          depthWrite: false,
        })
      );
      s.scale.set(2.4, 1.4, 1);
      escena.add(s);
      return s;
    });

    // Globo de la deuda
    const globo = new THREE.Group();
    const matGlobo = new THREE.MeshPhysicalMaterial({
      map: texturaGlobo(),
      roughness: 0.38,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      side: THREE.DoubleSide,
    });
    const rasgo = rasgable(matGlobo);
    const piel = new THREE.Mesh(geoGlobo(), matGlobo);
    const matLatex = new THREE.MeshPhysicalMaterial({ color: "#D8203F", roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.15, side: THREE.DoubleSide });
    const yNudo = -ESTIRA * 1.1;
    const nudo = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.032, 12, 28), matLatex);
    nudo.rotation.x = Math.PI / 2;
    nudo.position.y = yNudo - 0.04;
    const boca = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.12, 24), matLatex);
    boca.position.y = yNudo - 0.1;
    const curva = new THREE.CatmullRomCurve3(Array.from({ length: 14 }, (_, i) => V(Math.sin(i * 0.9) * 0.07, yNudo - 0.12 - i * 0.28, Math.cos(i * 0.7) * 0.05)));
    const hilo = new THREE.Mesh(new THREE.TubeGeometry(curva, 120, 0.007, 6), new THREE.MeshStandardMaterial({ color: "#F2F2F2", roughness: 0.6 }));
    globo.add(piel, nudo, boca, hilo);
    escena.add(globo);

    // --- Lo que sale al reventar
    const uTiempo = { value: 0 };
    const quieto = new THREE.Matrix4().makeScale(0, 0, 0);
    function enjambre(geo, mat, N) {
      const m = new THREE.InstancedMesh(geo, mat, N);
      for (let i = 0; i < N; i++) m.setMatrixAt(i, quieto);
      m.frustumCulled = false;
      escena.add(m);
      return m;
    }
    function fases(geo, N, semilla) {
      const rr = azar(semilla);
      geo.setAttribute("aFase", new THREE.InstancedBufferAttribute(Float32Array.from({ length: N }, () => rr() * 6.28), 1));
    }

    // Billetes y facturas: papel, mucho rozamiento, bajan despacio paleteando
    const NB = 300;
    const NF = 140;
    const geoB = new THREE.PlaneGeometry(0.46, 0.257, 12, 3);
    const geoF = new THREE.PlaneGeometry(0.26, 0.365, 6, 8);
    fases(geoB, NB, 3);
    fases(geoF, NF, 4);
    const matB = new THREE.MeshStandardMaterial({ map: texturaBillete(), side: THREE.DoubleSide, roughness: 0.85 });
    const matF = new THREE.MeshStandardMaterial({ map: texturaFactura(), side: THREE.DoubleSide, roughness: 0.9 });
    papel(matB, uTiempo, 0.018);
    papel(matF, uTiempo, 0.014);
    const billetes = enjambre(geoB, matB, NB);
    const facturas = enjambre(geoF, matF, NF);

    // Monedas: pesan, salen disparadas y caen rápido girando
    const NM = 90;
    const monedas = enjambre(
      new THREE.CylinderGeometry(0.075, 0.075, 0.016, 32),
      new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 1, roughness: 0.25, clearcoat: 0.5 }),
      NM
    );
    // Trozos de goma del propio globo
    const NG = 46;
    const forma = new THREE.Shape();
    const rg = azar(9);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const rad = 0.06 + rg() * 0.1;
      if (i === 0) forma.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
      else forma.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    const geoGoma = new THREE.ShapeGeometry(forma);
    const pg = geoGoma.attributes.position;
    for (let i = 0; i < pg.count; i++) pg.setZ(i, -2.5 * (pg.getX(i) ** 2 + pg.getY(i) ** 2)); // la goma rota se enrolla
    geoGoma.computeVertexNormals();
    const gomas = enjambre(geoGoma, matLatex, NG);

    const rp = azar(101);
    const dirAzar = () => V(rp() - 0.5, rp() - 0.5, rp() - 0.5).normalize();
    const R0 = radioGlobo(T_GOLPE);
    const crearPapel = (n, escMin, escMax) =>
      Array.from({ length: n }, () => {
        const d = dirAzar();
        const p0 = d.clone().multiplyScalar(Math.cbrt(rp()) * R0 * 0.85);
        p0.y *= ESTIRA;
        const v0 = d.clone().add(dirAzar().multiplyScalar(0.35)).normalize().multiplyScalar(2 + rp() * 8);
        v0.y += 1.2;
        return {
          p0, v0, c: 2.4 + rp() * 1.4, vt: 0.3 + rp() * 0.45, A: 0.06 + rp() * 0.22, w: 1.4 + rp() * 1.8, f: rp() * 6.28,
          giro: V(rp() * 2 - 1, rp() * 2 - 1, rp() * 2 - 1).multiplyScalar(14), lento: V(rp() - 0.5, rp() - 0.5, rp() - 0.5).multiplyScalar(2),
          esc: escMin + rp() * (escMax - escMin),
        };
      });
    const datosB = crearPapel(NB, 1.1, 1.6);
    const datosF = crearPapel(NF, 1.1, 1.5);
    const oro = new THREE.Color("#E2B654");
    const plata = new THREE.Color("#C9CED6");
    const datosM = Array.from({ length: NM }, (_, i) => {
      const d = dirAzar();
      monedas.setColorAt(i, rp() < 0.65 ? oro : plata);
      return {
        p0: d.clone().multiplyScalar(rp() * R0 * 0.7), v0: d.clone().multiplyScalar(3 + rp() * 7).add(V(0, 2, 0)),
        c: 0.7 + rp() * 0.4, vt: 9, A: 0, w: 0, f: rp() * 6.28, giro: V(rp(), rp(), rp()).multiplyScalar(30), esc: 0.9 + rp() * 0.5,
      };
    });
    monedas.instanceColor.needsUpdate = true;
    const datosG = Array.from({ length: NG }, () => {
      const d = dirAzar();
      return {
        n: d, v0: d.clone().multiplyScalar(4 + rp() * 7).add(dirAzar().multiplyScalar(1.5)),
        c: 2 + rp() * 1.5, vt: 4, A: 0, w: 0, f: rp() * 6.28, giro: V(rp(), rp(), rp()).multiplyScalar(25),
        esc: V(0.7 + rp() * 1.2, 0.5 + rp() * 1.4, 1), p0: V(0, 0, 0),
      };
    });

    // Nube de aire y polvo de talco que sale con el estallido
    const NN = 260;
    const posNiebla = new Float32Array(NN * 3);
    const dirNiebla = Array.from({ length: NN }, () => [dirAzar(), 0.6 + rp() * 0.8]);
    const geoNiebla = new THREE.BufferGeometry();
    geoNiebla.setAttribute("position", new THREE.BufferAttribute(posNiebla, 3));
    const matNiebla = new THREE.PointsMaterial({ map: texturaNiebla(), color: "#FFD9E1", size: 0.6, transparent: true, opacity: 0, depthWrite: false });
    const niebla = new THREE.Points(geoNiebla, matNiebla);
    niebla.frustumCulled = false;
    escena.add(niebla);

    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eul = new THREE.Euler();
    const esc = V(1, 1, 1);
    const p = V(0, 0, 0);
    const abajo = V(0, -1, 0);
    const qInv = new THREE.Quaternion();
    const golpeDir = metas[0].clone().normalize();
    const golpeDir2 = metas[1].clone().normalize();
    // la goma que queda se retrae hacia el lado contrario a los dos pinchazos
    const retrae = golpeDir.clone().add(golpeDir2).normalize();
    const envolver = (y, lo, h) => ((((y - lo) % h) + h) % h) + lo;

    // Tamaño
    let zs = 1;
    const ajustar = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      zs = cam.aspect < 1 ? 1.25 + (1 - cam.aspect) * 1.2 : 1;
      mediaVista = 19 * zs * Math.tan((19 * Math.PI) / 180) * cam.aspect;
      cam.updateProjectionMatrix();
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    // Scroll → T
    let visible = true;
    const leerScroll = () => {
      const escenas = [...document.querySelectorAll("[data-escena]")].sort((a, b) => a.dataset.escena - b.dataset.escena);
      let T = 0;
      visible = false;
      escenas.forEach((s, i) => {
        const rc = s.getBoundingClientRect();
        if (rc.top < window.innerHeight && rc.bottom > 0) visible = true;
        if (rc.top <= 0) T = i + clamp(-rc.top / Math.max(1, rc.height - window.innerHeight));
      });
      fijarT(T);
    };
    leerScroll();
    window.addEventListener("scroll", leerScroll, { passive: true });
    window.addEventListener("resize", leerScroll);

    let raf;
    let tPum = null; // segundo en que revienta el globo
    let enReposo = true; // los trozos están escondidos
    const reloj = new THREE.Clock();
    const pintar = () => {
      raf = requestAnimationFrame(pintar);
      const T = store.T;
      const t = reloj.getElapsedTime();
      uTiempo.value = t;

      if (T >= T_GOLPE && tPum === null) tPum = t;
      if (T < T_GOLPE) tPum = null;
      const tau = tPum === null ? -1 : t - tPum;

      // Capa de color y destello (también fuera del canvas)
      const c = capa(T);
      if (capaRef.current) {
        capaRef.current.style.background = c.color;
        capaRef.current.style.opacity = c.o;
      }
      if (flashRef.current) flashRef.current.style.opacity = tau >= 0 ? Math.exp(-tau * 6) * 0.55 * clamp(tau * 20) : 0;
      if (!visible) return;

      // Flechas
      flechas.forEach((f, k) => {
        const { punta, dir } = flecha(k, T);
        if (tau > 0) punta.addScaledVector(dir, tau * 5); // atraviesan el globo y siguen
        f.position.copy(punta);
        f.quaternion.setFromUnitVectors(abajo, dir);
        f.rotateY(t * 0.8 + k);
        const rot = rotulos[k];
        rot.position.copy(punta).addScaledVector(dir, -1.6).add(V(0, 1.3, 0.3));
        rot.material.opacity = 1 - tramo(T, 2.4, 2.55);
        f.visible = T < T_GOLPE + 0.15 && tau < 1.1;
      });

      // Globo: crece, respira, las flechas lo aprietan por los lados, tiembla y se rasga desde los dos pinchazos
      const R = radioGlobo(T);
      const aprieta = suave(tramo(T, T_GOLPE - 0.1, T_GOLPE));
      const tiembla = T > T_GOLPE - 0.1 && T < T_GOLPE ? Math.sin(t * 55) * 0.025 * aprieta : 0;
      const abre = tau >= 0 ? clamp(tau / DURA_RASGO) : 0;
      const rasgado = 1 - (1 - abre) * (1 - abre); // rápido al principio y frena, como el látex al abrirse
      globo.rotation.y = Math.sin(t * 0.5) * 0.15 * (1 - aprieta);
      globo.position.set(0, Math.sin(t * 0.9) * 0.05, 0);
      const base = R * (1 + Math.sin(t * 1.4) * 0.012 + tiembla) * (1 - 0.4 * rasgado * rasgado);
      const presion = tau >= 0 ? 1 - abre : aprieta;
      globo.scale.set(base * (1 - 0.07 * presion), base * (1 + 0.05 * presion), base * (1 + 0.03 * presion));
      globo.position.addScaledVector(retrae, -0.7 * rasgado);
      qInv.copy(globo.quaternion).invert();
      rasgo.uDir.value.copy(golpeDir).applyQuaternion(qInv);
      rasgo.uDir2.value.copy(golpeDir2).applyQuaternion(qInv);
      rasgo.uRasgo.value = tau >= 0 ? rasgado * 2.4 : 0;
      globo.visible = abre < 1;
      halo.material.opacity = 0.32 * (1 - rasgado) + 0.3 * Math.exp(-Math.max(0, tau) * 2) * (tau >= 0 ? 1 : 0);

      // Lo que sale
      if (tau >= 0) {
        enReposo = false;
        const ponPapel = (m, datos) => {
          datos.forEach((d, i) => {
            const e = vuelo(d, tau, p);
            p.y = envolver(p.y, -6, 13); // lluvia de dinero que no se acaba
            eul.set(d.f + d.giro.x * e + d.lento.x * tau + Math.sin(tau * 1.3 + d.f) * 0.5, d.giro.y * e + d.lento.y * tau, d.giro.z * e + d.lento.z * tau);
            q.setFromEuler(eul);
            esc.setScalar(d.esc);
            m.setMatrixAt(i, m4.compose(p, q, esc));
          });
          m.instanceMatrix.needsUpdate = true;
        };
        ponPapel(billetes, datosB);
        ponPapel(facturas, datosF);

        datosM.forEach((d, i) => {
          vuelo(d, tau, p);
          eul.set(d.f + d.giro.x * tau, d.giro.y * tau, d.giro.z * tau);
          q.setFromEuler(eul);
          esc.setScalar(tau < 4 ? d.esc : 0);
          monedas.setMatrixAt(i, m4.compose(p, q, esc));
        });
        monedas.instanceMatrix.needsUpdate = true;

        datosG.forEach((d, i) => {
          // salen de la piel justo cuando el desgarro pasa por su sitio
          const a = Math.min(Math.acos(clamp(d.n.dot(golpeDir), -1, 1)), Math.acos(clamp(d.n.dot(golpeDir2), -1, 1)));
          const t0 = (1 - Math.sqrt(Math.max(0, 1 - a / 2.4))) * DURA_RASGO; // inversa de la curva del rasgado
          const tt = Math.max(0, tau - t0);
          d.p0.set(d.n.x * R0, d.n.y * R0 * ESTIRA, d.n.z * R0);
          vuelo(d, tt, p);
          eul.set(d.f + d.giro.x * tt, d.giro.y * tt, d.giro.z * tt);
          q.setFromEuler(eul);
          if (tau > t0 && tau < 3) esc.copy(d.esc);
          else esc.setScalar(0);
          gomas.setMatrixAt(i, m4.compose(p, q, esc));
        });
        gomas.instanceMatrix.needsUpdate = true;

        dirNiebla.forEach(([d, v], i) => {
          const k = R0 * 0.9 + 2.4 * v * (1 - Math.exp(-4 * tau));
          posNiebla[i * 3] = d.x * k;
          posNiebla[i * 3 + 1] = d.y * k * ESTIRA - tau * 0.15;
          posNiebla[i * 3 + 2] = d.z * k;
        });
        geoNiebla.attributes.position.needsUpdate = true;
        matNiebla.opacity = 0.5 * Math.exp(-tau * 1.8) * clamp(tau * 30);
        matNiebla.size = 0.5 + tau * 0.9;
      } else if (!enReposo) {
        enReposo = true;
        [billetes, facturas, monedas, gomas].forEach((m) => {
          for (let i = 0; i < m.count; i++) m.setMatrixAt(i, quieto);
          m.instanceMatrix.needsUpdate = true;
        });
        matNiebla.opacity = 0;
      }

      // Cámara (con sacudida al reventar)
      const k = camara(T, zs);
      cam.position.copy(k.pos);
      const sac = tau >= 0 ? 0.14 * Math.exp(-tau * 6) : 0;
      if (sac > 0.001) cam.position.add(V(Math.sin(t * 93) * sac, Math.cos(t * 71) * sac, 0));
      cam.lookAt(k.mira);
      cam.fov = k.fov;
      cam.updateProjectionMatrix();
      polvo.rotation.y = t * 0.01;

      renderer.render(escena, cam);
    };
    pintar();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ajustar);
      window.removeEventListener("scroll", leerScroll);
      window.removeEventListener("resize", leerScroll);
      escena.traverse((o) => {
        o.geometry?.dispose?.();
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        ms.forEach((m) => {
          m.map?.dispose?.();
          m.dispose();
        });
      });
      entorno.dispose();
      pmrem.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <div ref={montaje} className="absolute inset-0 [&>canvas]:w-full [&>canvas]:h-full" />
      <div ref={capaRef} className="absolute inset-0" style={{ opacity: 0 }} />
      <div ref={flashRef} className="absolute inset-0 bg-white" style={{ opacity: 0 }} />
    </div>
  );
}
