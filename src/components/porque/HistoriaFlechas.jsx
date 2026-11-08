import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

// Historia de «Por qué invertir» en 3D, controlada por el scroll.
// Dos flechas (motivo 1: el euro, motivo 2: las pensiones) caen hacia un globo (motivo 3: la deuda).
// El tiempo de la historia T va de 0 a 3: cada escena de la página ([data-escena="0|1|2"]) avanza una unidad.
//   0 → 1   título, la cámara entra en la flecha 1
//   1 → 2   sale, las flechas se acercan, entra en la flecha 2
//   2 → 3   sale, las flechas pinchan el globo, revienta y se llena todo de billetes y facturas de intereses
// Todo depende solo de T, así que funciona igual subiendo que bajando.

export const COLORES = { euro: "#6CB4FF", pensiones: "#F5C542", deuda: "#FF5C7A", fondo: "#01010D" };

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
const enOut = (x) => 1 - Math.pow(1 - x, 3);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const T_GOLPE = 2.55; // las flechas tocan el globo
const radioGlobo = (T) => 1.5 + 0.16 * Math.min(T, T_GOLPE); // la deuda no para de crecer
const ESTIRA = 1.12; // el globo es algo más alto que ancho

const SALIDAS = [V(-3.6, 5.6, 0.4), V(3.5, 6.6, -0.8)];
const DIRS = [V(-0.42, 1, 0.25), V(0.4, 1, 0.1)];
const metas = DIRS.map((d) => {
  const n = d.clone().normalize();
  const R = radioGlobo(T_GOLPE);
  return V(n.x * R, n.y * R * ESTIRA, n.z * R);
});

function flecha(k, T) {
  const dir = metas[k].clone().sub(SALIDAS[k]).normalize();
  const s = Math.pow(clamp(T / T_GOLPE), 1.35);
  const punta = SALIDAS[k].clone().lerp(metas[k], s);
  if (T > T_GOLPE) punta.addScaledVector(dir, (T - T_GOLPE) * 4);
  const cabeza = punta.clone().addScaledVector(dir, -0.5);
  return { punta, dir, cabeza };
}

function planoGeneral(T, zs) {
  const y = 3.4 - 1.8 * suave(clamp(T / T_GOLPE));
  return { pos: V(0, y + 1.4, 19 * zs), mira: V(0, y, 0), fov: 38 };
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
  const cerca = { pos: V(0, 2.4, 10 * zs), mira: V(0, 1.4, 0), fov: 40 };
  if (T < 2.35) return mezcla(dentroDe(1, T, zs), cerca, suave(tramo(T, 2, 2.35)));
  if (T < T_GOLPE) return cerca;
  const dentro = { pos: V(0, 0.4, 2.2), mira: V(0, 0, -2), fov: 60 };
  return mezcla(cerca, dentro, suave(tramo(T, T_GOLPE + 0.05, 3)));
}

// Capa de color que llena la pantalla al entrar en una flecha / al reventar el globo
function capa(T) {
  if (T < 1) return { color: COLORES.euro, o: tramo(T, 0.86, 0.99) };
  if (T < 1.5) return { color: COLORES.euro, o: 1 - tramo(T, 1.01, 1.14) };
  if (T < 2) return { color: COLORES.pensiones, o: tramo(T, 1.86, 1.99) };
  if (T < 2.5) return { color: COLORES.pensiones, o: 1 - tramo(T, 2.01, 2.14) };
  return { color: COLORES.deuda, o: tramo(T, 2.86, 0.99 + 2) };
}

// --- Texturas dibujadas en canvas
function texturaTexto(lineas, { ancho = 512, alto = 256, color = "#fff", fondo = null, tam = 90 } = {}) {
  const c = document.createElement("canvas");
  c.width = ancho;
  c.height = alto;
  const g = c.getContext("2d");
  if (fondo) {
    g.fillStyle = fondo;
    g.fillRect(0, 0, ancho, alto);
  }
  g.fillStyle = color;
  g.textAlign = "center";
  g.textBaseline = "middle";
  lineas.forEach((l, i) => {
    g.font = `${l.peso || 800} ${l.tam || tam}px "Anton", "Impact", sans-serif`;
    g.fillStyle = l.color || color;
    g.fillText(l.t, ancho / 2, alto / 2 + (i - (lineas.length - 1) / 2) * (l.tam || tam) * 1.05);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function texturaBillete() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const g = c.getContext("2d");
  g.fillStyle = "#3E9E6A";
  g.fillRect(0, 0, 256, 128);
  g.strokeStyle = "#CFF5DD";
  g.lineWidth = 6;
  g.strokeRect(10, 10, 236, 108);
  g.beginPath();
  g.arc(128, 64, 34, 0, Math.PI * 2);
  g.fillStyle = "#2C7A4F";
  g.fill();
  g.fillStyle = "#E9FFF1";
  g.font = '900 52px "Anton", Impact, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("€", 128, 66);
  g.font = '700 22px "Anton", Impact, sans-serif';
  g.fillText("100", 40, 34);
  g.fillText("100", 216, 96);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaFactura() {
  const c = document.createElement("canvas");
  c.width = 192;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#F7F3EA";
  g.fillRect(0, 0, 192, 256);
  g.fillStyle = "#FF5C7A";
  g.fillRect(0, 0, 192, 46);
  g.fillStyle = "#fff";
  g.font = '800 24px "Anton", Impact, sans-serif';
  g.textAlign = "center";
  g.fillText("INTERESES", 96, 32);
  g.fillStyle = "#C9C2B4";
  for (let i = 0; i < 6; i++) g.fillRect(22, 70 + i * 22, 100 + ((i * 37) % 50), 8);
  g.fillStyle = "#FF5C7A";
  g.font = '900 64px "Anton", Impact, sans-serif';
  g.fillText("%", 96, 236);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Números pseudoaleatorios repetibles (la explosión es siempre igual, también hacia atrás)
function azar(semilla) {
  let s = semilla;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function crearFlecha(color) {
  const grupo = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15 });
  const cabeza = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1, 48), mat);
  cabeza.rotation.x = Math.PI; // punta hacia -Y
  cabeza.position.y = 0.5;
  const asta = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 32), mat);
  asta.position.y = 1 + 1.4;
  grupo.add(cabeza, asta);
  const matPluma = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.5, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) {
    const pluma = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.42), matPluma);
    pluma.position.y = 3.45;
    pluma.rotation.y = (i * Math.PI * 2) / 3;
    pluma.geometry.translate(0, 0, 0.24);
    grupo.add(pluma);
  }
  return grupo;
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
    escena.fog = new THREE.Fog(COLORES.fondo, 18, 42);
    const cam = new THREE.PerspectiveCamera(38, 1, 0.05, 100);

    // Luces
    escena.add(new THREE.HemisphereLight("#BFC8FF", "#1A1040", 0.9));
    const sol = new THREE.DirectionalLight("#ffffff", 2.2);
    sol.position.set(6, 12, 9);
    escena.add(sol);
    const contra = new THREE.PointLight("#6331FB", 60, 30);
    contra.position.set(-4, 3, -6);
    escena.add(contra);
    const calida = new THREE.PointLight("#FF5C7A", 25, 20);
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
    const flechas = [COLORES.euro, COLORES.pensiones].map((c) => {
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
      color: COLORES.deuda,
      roughness: 0.18,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      sheen: 0.6,
      sheenColor: new THREE.Color("#FFC2CF"),
    });
    const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), matGlobo);
    cuerpo.scale.set(1, ESTIRA, 1);
    const nudo = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 24), matGlobo);
    nudo.position.y = -ESTIRA - 0.06;
    const hilo = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 30 }, (_, i) => V(Math.sin(i * 0.5) * 0.08, -ESTIRA - 0.15 - i * 0.12, 0))
      ),
      new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.5 })
    );
    const etiqueta = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.8),
      new THREE.MeshBasicMaterial({
        map: texturaTexto([{ t: "3", tam: 110, color: "#fff" }, { t: "DEUDA", tam: 80 }], { alto: 260 }),
        transparent: true,
        depthWrite: false,
      })
    );
    etiqueta.position.z = 1.02;
    globo.add(cuerpo, nudo, hilo, etiqueta);
    escena.add(globo);

    // Explosión: billetes y facturas de intereses
    const N = 420;
    const geoBillete = new THREE.PlaneGeometry(0.5, 0.25);
    const geoFactura = new THREE.PlaneGeometry(0.3, 0.4);
    const billetes = new THREE.InstancedMesh(geoBillete, new THREE.MeshStandardMaterial({ map: texturaBillete(), side: THREE.DoubleSide, roughness: 0.7 }), N);
    const facturas = new THREE.InstancedMesh(geoFactura, new THREE.MeshStandardMaterial({ map: texturaFactura(), side: THREE.DoubleSide, roughness: 0.8 }), N);
    escena.add(billetes, facturas);
    const trozos = [billetes, facturas].map((_, j) => {
      const rr = azar(101 + j);
      return Array.from({ length: N }, () => {
        const v = V(rr() - 0.5, rr() - 0.45, rr() - 0.35).normalize().multiplyScalar(0.8 + rr() * 2.6);
        return { v, giro: V(rr() * 8, rr() * 8, rr() * 8), fase: rr() * 6.28, ini: V((rr() - 0.5) * 1.6, (rr() - 0.5) * 1.6, (rr() - 0.5) * 1.6) };
      });
    });
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eul = new THREE.Euler();
    const esc = V(1, 1, 1);
    const p = V(0, 0, 0);
    const abajo = V(0, -1, 0);

    // Tamaño
    let zs = 1;
    const ajustar = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      zs = cam.aspect < 1 ? 1.25 + (1 - cam.aspect) * 1.2 : 1;
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
        const r = s.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) visible = true;
        if (r.top <= 0) T = i + clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      });
      fijarT(T);
    };
    leerScroll();
    window.addEventListener("scroll", leerScroll, { passive: true });
    window.addEventListener("resize", leerScroll);

    let raf;
    const reloj = new THREE.Clock();
    const pintar = () => {
      raf = requestAnimationFrame(pintar);
      const T = store.T;
      const t = reloj.getElapsedTime();

      // Capa de color y destello (también fuera del canvas)
      const c = capa(T);
      if (capaRef.current) {
        capaRef.current.style.background = c.color;
        capaRef.current.style.opacity = c.o;
      }
      if (flashRef.current) {
        const f = T > T_GOLPE ? Math.max(0, 1 - (T - T_GOLPE) / 0.06) : 0;
        flashRef.current.style.opacity = f * 0.75;
      }
      if (!visible) return;

      // Flechas
      flechas.forEach((f, k) => {
        const { punta, dir } = flecha(k, T);
        f.position.copy(punta);
        f.quaternion.setFromUnitVectors(abajo, dir);
        f.rotateY(t * 0.6 + k);
        const rot = rotulos[k];
        rot.position.copy(punta).addScaledVector(dir, -1.2).add(V(k === 0 ? -1.5 : 1.5, 0, 0.3));
        rot.material.opacity = 1 - tramo(T, 2.12, 2.28);
        f.visible = T < T_GOLPE + 0.1;
      });

      // Globo: crece, respira y revienta
      const R = radioGlobo(T);
      const pum = tramo(T, T_GOLPE, T_GOLPE + 0.04);
      const tiembla = T > T_GOLPE - 0.08 && T < T_GOLPE ? Math.sin(t * 60) * 0.03 : 0;
      const s = R * (1 + Math.sin(t * 1.4) * 0.012 + tiembla) * (1 + pum * 0.25);
      globo.scale.setScalar(s);
      globo.visible = pum < 1;
      globo.rotation.y = Math.sin(t * 0.5) * 0.15;
      globo.position.y = Math.sin(t * 0.9) * 0.05;

      // Trozos
      const tau = Math.max(0, T - T_GOLPE);
      [billetes, facturas].forEach((m, j) => {
        trozos[j].forEach((d, i) => {
          if (tau <= 0) {
            esc.setScalar(0);
          } else {
            const k = enOut(clamp(tau / 0.3)) * 1.5 + tau * 0.7;
            p.copy(d.ini).addScaledVector(d.v, k);
            p.y += Math.sin(t * 1.5 + d.fase) * 0.15 * clamp(tau * 4);
            eul.set(d.giro.x * tau + d.fase + t * 0.3, d.giro.y * tau + t * 0.2, d.giro.z * tau);
            q.setFromEuler(eul);
            esc.setScalar(clamp(tau / 0.05) * 1.4);
          }
          m4.compose(p, q, esc);
          m.setMatrixAt(i, m4);
        });
        m.instanceMatrix.needsUpdate = true;
      });

      // Cámara
      const k = camara(T, zs);
      cam.position.copy(k.pos);
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
      renderer.dispose();
      escena.traverse((o) => {
        o.geometry?.dispose?.();
        const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        ms.forEach((m) => {
          m.map?.dispose?.();
          m.dispose();
        });
      });
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
