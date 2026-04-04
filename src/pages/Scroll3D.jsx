import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function padNumber(n, width) {
  const s = String(n);
  return s.length >= width ? s : "0".repeat(width - s.length) + s;
}

function drawCover(ctx, img, width, height) {
  if (!img || !img.naturalWidth || !img.naturalHeight) return;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function Scroll3D({
  children,
  behavior = "sticky", // "sticky" (sección) | "fixed" (demo)
  scrollVh,
  manifestUrl = "/frames/caixa_video1/manifest.json",
}) {
  const containerRef = useRef(null);
  const fixedLayerRef = useRef(null);
  const fixedOverlayRef = useRef(null);
  const canvasRef = useRef(null);

  const rafIdRef = useRef(null);
  const lastTickRef = useRef(0);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  const imagesRef = useRef([]);
  const [frameCount, setFrameCount] = useState(0);
  const [manifest, setManifest] = useState(null);
  const [topOffsetPx, setTopOffsetPx] = useState(0);

  const scrollHeightVh = useMemo(() => {
    if (Number.isFinite(scrollVh) && scrollVh > 0) return scrollVh;
    if (!frameCount) return 500;
    // Regla simple: ~200 frames => 800vh
    return clamp(Math.ceil(frameCount * 4), 400, 1400);
  }, [frameCount, scrollVh]);

  const frameHeight = useMemo(() => `calc(100vh - ${topOffsetPx}px)`, [topOffsetPx]);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (!header) {
        setTopOffsetPx(0);
        return;
      }

      const style = window.getComputedStyle(header);
      const isFixed = style.position === "fixed";
      setTopOffsetPx(isFixed ? Math.max(0, Math.round(header.getBoundingClientRect().height)) : 0);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const res = await fetch(manifestUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`No se pudo cargar manifest: ${manifestUrl}`);
      const data = await res.json();
      if (cancelled) return;

      const fc = Number(data?.frameCount) || 0;
      if (!fc) throw new Error("manifest.json no tiene frameCount válido");

      setManifest(data);
      setFrameCount(fc);
    };

    load().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Scroll3D manifest load error", err);
      setManifest(null);
      setFrameCount(0);
    });

    return () => {
      cancelled = true;
    };
  }, [manifestUrl]);

  // Preload: primero el frame 1 para pintar algo rápido, luego el resto.
  useEffect(() => {
    if (!manifest || !frameCount) return;

    imagesRef.current = new Array(frameCount);

    const { basePath = "/frames/caixa_video1", pad = 4, extension = "webp" } = manifest;

    const makeUrl = (idx0) => {
      const n = idx0 + 1;
      return `${basePath}/frame_${padNumber(n, pad)}.${extension}`;
    };

    let cancelled = false;

    const loadOne = (idx0) => {
      if (idx0 < 0 || idx0 >= frameCount) return;
      if (imagesRef.current[idx0]) return;

      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = makeUrl(idx0);
      imagesRef.current[idx0] = img;
    };

    // Carga el primero
    loadOne(0);

    // Carga el resto en background
    const preloadAll = async () => {
      for (let i = 1; i < frameCount; i += 1) {
        if (cancelled) return;
        loadOne(i);
        // Evita bloquear el hilo principal
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 0));
      }
    };

    void preloadAll();

    return () => {
      cancelled = true;
    };
  }, [manifest, frameCount]);

  // Canvas resize + dibujo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const nextW = Math.max(1, Math.round(rect.width * dpr));
      const nextH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== nextW) canvas.width = nextW;
      if (canvas.height !== nextH) canvas.height = nextH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Redibuja con el frame actual
      const idx = clamp(Math.round(currentFrameRef.current), 0, Math.max(0, frameCount - 1));
      const img = imagesRef.current[idx];
      if (img && img.complete) {
        drawCover(ctx, img, rect.width, rect.height);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, [frameCount]);

  // Loop RAF: persigue targetFrame con "cámara rápida" y dibuja en canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frameCount) return;

    const tick = (ts) => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const last = lastTickRef.current || ts;
      let dt = (ts - last) / 1000;
      lastTickRef.current = ts;
      dt = clamp(dt, 0, 0.05);

      const target = clamp(Math.round(targetFrameRef.current), 0, frameCount - 1);
      const current = clamp(Math.round(currentFrameRef.current), 0, frameCount - 1);
      const diff = target - current;

      if (diff !== 0) {
        // frames por segundo (variable): más lejos => más rápido.
        const speed = clamp(30 + Math.abs(diff) * 2, 40, 240);
        const maxStep = Math.max(1, Math.floor(speed * dt));
        const next = current + Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
        currentFrameRef.current = next;
      }

      const rect = c.getBoundingClientRect();
      const idx = clamp(Math.round(currentFrameRef.current), 0, frameCount - 1);
      const img = imagesRef.current[idx];

      if (img) {
        if (img.complete) {
          drawCover(ctx, img, rect.width, rect.height);
        } else {
          img.onload = () => {
            const c2 = canvasRef.current;
            if (!c2) return;
            const ctx2 = c2.getContext("2d");
            if (!ctx2) return;
            const r2 = c2.getBoundingClientRect();
            const idx2 = clamp(Math.round(currentFrameRef.current), 0, frameCount - 1);
            const img2 = imagesRef.current[idx2];
            if (img2 && img2.complete) drawCover(ctx2, img2, r2.width, r2.height);
          };
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTickRef.current = 0;
    };
  }, [frameCount]);

  // ScrollTrigger: controla visibilidad (modo sección) y targetFrame.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frameCount) return;

    const ctx = gsap.context(() => {
      const fixedLayer = fixedLayerRef.current;
      const fixedOverlay = fixedOverlayRef.current;
      const isAlwaysVisible = behavior === "fixed";

      if (!isAlwaysVisible) {
        gsap.set([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 0 });
      } else {
        gsap.set([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 1 });
      }

      const st = ScrollTrigger.create({
        trigger: container,
        start: () => `top top+=${topOffsetPx}`,
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onEnter: () => {
          if (isAlwaysVisible) return;
          gsap.to([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 1, duration: 0.15, overwrite: true });
        },
        onEnterBack: () => {
          if (isAlwaysVisible) return;
          gsap.to([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 1, duration: 0.15, overwrite: true });
        },
        onLeave: () => {
          if (isAlwaysVisible) return;
          gsap.to([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 0, duration: 0.15, overwrite: true });
        },
        onLeaveBack: () => {
          if (isAlwaysVisible) return;
          gsap.to([fixedLayer, fixedOverlay].filter(Boolean), { autoAlpha: 0, duration: 0.15, overwrite: true });
        },
        onUpdate: (self) => {
          const idx = clamp(Math.round(self.progress * (frameCount - 1)), 0, frameCount - 1);
          targetFrameRef.current = idx;
        },
      });

      return () => st.kill();
    }, container);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [behavior, frameCount, topOffsetPx]);

  return (
    <div
      ref={containerRef}
      className={behavior === "fixed" ? "relative bg-black" : "relative bg-transparent"}
      style={{ height: `${scrollHeightVh}vh` }}
    >
      {/* Capa fija del canvas */}
      <div
        ref={fixedLayerRef}
        className="fixed left-0 right-0 bg-black z-0 pointer-events-none"
        style={{ top: `${topOffsetPx}px`, height: frameHeight }}
      >
        <canvas ref={canvasRef} className="block h-full w-full pointer-events-none" />
      </div>

      {/* Overlay encima (tarjetas, etc) */}
      {children ? (
        <div
          ref={fixedOverlayRef}
          className="fixed left-0 right-0 z-20 pointer-events-none"
          style={{ top: `${topOffsetPx}px`, height: frameHeight }}
        >
          <div className="h-full w-full">{children}</div>
        </div>
      ) : null}

      {/* Spacer de scroll */}
      <div aria-hidden className="h-full" />
    </div>
  );
}
