import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Frames disponibles - actualitzar quan n'hi hagi més
const FRAME_NAMES = [
  "caixa_forta_volant",
  "caixa_ordenada1",
  "caixa_ordenada2"
];

function ScrollVault() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const imagesRef = useRef([]);

  // Precarregar imatges
  useEffect(() => {
    let loadedCount = 0;

    FRAME_NAMES.forEach((name, index) => {
      const img = new Image();
      img.src = `/frames/${name}.png`;
      img.onload = () => {
        imagesRef.current[index] = img;
        loadedCount++;
        if (loadedCount === FRAME_NAMES.length) {
          setLoaded(true);
        }
      };
    });
  }, []);

  // Animació amb scroll
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Canvas sticky que canvia segons scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            Math.floor(self.progress * FRAME_NAMES.length),
            FRAME_NAMES.length - 1
          );
          setCurrentFrame(frameIndex);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loaded]);

  // Renderitzar canvas
  useEffect(() => {
    if (!canvasRef.current || !loaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[currentFrame];

    if (img) {
      const dpr = window.devicePixelRatio || 1;
      const containerWidth = canvas.offsetWidth;
      const containerHeight = canvas.offsetHeight;

      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      ctx.scale(dpr, dpr);

      // Calcular escala per mantenir proporció
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      ) * 0.9;

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const x = (containerWidth - newWidth) / 2;
      const y = (containerHeight - newHeight) / 2;

      ctx.clearRect(0, 0, containerWidth, containerHeight);
      ctx.drawImage(img, x, y, newWidth, newHeight);
    }
  }, [currentFrame, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#7dd0e3]"
      style={{ height: `${FRAME_NAMES.length * 100}vh` }}
    >
      {/* Canvas sticky */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export default ScrollVault;