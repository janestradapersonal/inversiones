import { useEffect, useRef } from "react";

// Fondo interactivo: el ratón deja una línea como la de un gráfico de bolsa y suelta flechas.
// Si sube, flechas menta que suben; si baja, flechas rojas que bajan.
const MENTA = [159, 232, 112];
const ROJO = [255, 92, 122];
const VIDA_LINEA = 650; // ms que dura cada tramo de la línea
const VIDA_FLECHA = 1100; // ms que dura cada flecha
const PASO_FLECHA = 38; // px de recorrido entre flecha y flecha

const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

function dibujarFlecha(ctx, x, y, tam, sube, color) {
  ctx.save();
  ctx.translate(x, y);
  if (!sube) ctx.rotate(Math.PI);
  ctx.beginPath();
  // punta
  ctx.moveTo(0, -tam);
  ctx.lineTo(tam * 0.75, -tam * 0.15);
  ctx.lineTo(tam * 0.28, -tam * 0.15);
  // palo
  ctx.lineTo(tam * 0.28, tam);
  ctx.lineTo(-tam * 0.28, tam);
  ctx.lineTo(-tam * 0.28, -tam * 0.15);
  ctx.lineTo(-tam * 0.75, -tam * 0.15);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = tam;
  ctx.fill();
  ctx.restore();
}

export default function CursorGlow() {
  const capaRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const capa = capaRef.current;
    const canvas = canvasRef.current;
    if (!capa || !canvas) return;
    // En móviles (sin ratón) no se activa
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ctx = canvas.getContext("2d");
    const raiz = document.documentElement;
    let puntos = []; // estela: {x, y, t}
    let flechas = []; // {x, y, sube, t, tam, deriva}
    let recorrido = 0;
    let tendencia = 0; // >0 sube, <0 baja (suavizada)
    let ultimo = null;
    let frame = null;

    const ajustar = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();

    const pintar = () => {
      const ahora = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Línea tipo gráfico: cada tramo en menta si sube o en rojo si baja
      puntos = puntos.filter((p) => ahora - p.t < VIDA_LINEA);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < puntos.length; i++) {
        const a = puntos[i - 1];
        const b = puntos[i];
        const vida = 1 - (ahora - b.t) / VIDA_LINEA;
        const color = b.y <= a.y ? MENTA : ROJO;
        ctx.strokeStyle = rgba(color, 0.9 * vida);
        ctx.lineWidth = 1 + 3 * vida;
        ctx.shadowColor = rgba(color, 0.8 * vida);
        ctx.shadowBlur = 10 * vida;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Flechas que suben o bajan y se desvanecen
      flechas = flechas.filter((f) => ahora - f.t < VIDA_FLECHA);
      for (const f of flechas) {
        const edad = (ahora - f.t) / VIDA_FLECHA;
        const dy = (f.sube ? -1 : 1) * 70 * edad;
        const alfa = edad < 0.1 ? edad / 0.1 : Math.min(1, 1.25 * (1 - edad));
        dibujarFlecha(ctx, f.x + f.deriva * edad, f.y + dy, f.tam * (0.8 + 0.4 * edad), f.sube, rgba(f.sube ? MENTA : ROJO, alfa));
      }

      frame = puntos.length > 1 || flechas.length ? requestAnimationFrame(pintar) : null;
      if (!frame) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const ahora = performance.now();
      raiz.style.setProperty("--x", `${x}px`);
      raiz.style.setProperty("--y", `${y}px`);
      raiz.classList.add("cursor-activo");
      capa.style.opacity = "1";

      // Un salto grande (al volver a entrar en la ventana) empieza una línea nueva
      if (ultimo && Math.hypot(x - ultimo.x, y - ultimo.y) > 200) {
        puntos = [];
        ultimo = null;
      }
      if (ultimo) {
        const dx = x - ultimo.x;
        const dy = y - ultimo.y;
        tendencia = tendencia * 0.8 + -dy * 0.2;
        recorrido += Math.hypot(dx, dy);
        if (recorrido > PASO_FLECHA && Math.abs(tendencia) > 0.4) {
          recorrido = 0;
          flechas.push({
            x: x + (Math.random() - 0.5) * 24,
            y: y + (Math.random() - 0.5) * 12,
            sube: tendencia > 0,
            t: ahora,
            tam: 9 + Math.random() * 7,
            deriva: (Math.random() - 0.5) * 30,
          });
          if (flechas.length > 40) flechas.shift();
        }
        // El brillo toma el color de la tendencia
        raiz.style.setProperty("--brillo", tendencia >= 0 ? "159, 232, 112" : "255, 92, 122");
      }
      ultimo = { x, y };
      puntos.push({ x, y, t: ahora });
      if (frame === null) frame = requestAnimationFrame(pintar);
    };

    const onLeave = () => {
      capa.style.opacity = "0";
      raiz.classList.remove("cursor-activo");
      ultimo = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", ajustar);
    raiz.addEventListener("pointerleave", onLeave);
    return () => {
      raiz.classList.remove("cursor-activo");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", ajustar);
      raiz.removeEventListener("pointerleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      {/* Brillo que sigue al ratón: menta si sube, rojo si baja */}
      <div
        ref={capaRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(var(--brillo, 159, 232, 112), 0.22), rgba(var(--brillo, 159, 232, 112), 0.06) 35%, transparent 65%)",
        }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 z-40" />
    </div>
  );
}
