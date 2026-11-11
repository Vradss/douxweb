"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const TEXT = "Coming soon";

/** Desplazamiento máximo de las filas de atrás (no salen de pantalla). */
const SHIFT = 11; // % del ancho de la fila (≈ vw)

export default function ComingSoon() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  // Posición del cursor sobre la foto, normalizada (-0.5 … 0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.6 });

  // Filas de atrás: arriba y abajo se mueven en sentidos opuestos → diagonal
  const topX = useTransform(sx, [-0.5, 0.5], [`-${SHIFT}%`, `${SHIFT}%`]);
  const bottomX = useTransform(sx, [-0.5, 0.5], [`${SHIFT}%`, `-${SHIFT}%`]);

  // Foto: leve inclinación + parallax interno
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const imgX = useTransform(sx, [-0.5, 0.5], ["3%", "-3%"]);
  const imgY = useTransform(sy, [-0.5, 0.5], ["3%", "-3%"]);

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  return (
    <>
      <div className="rows">
        <motion.div className="row row--back" style={{ x: topX }} aria-hidden>
          {TEXT}
        </motion.div>
        <h1 className="row row--front">{TEXT}</h1>
        <motion.div className="row row--back" style={{ x: bottomX }} aria-hidden>
          {TEXT}
        </motion.div>
      </div>

      <motion.div
        ref={ref}
        className="photo-wrap"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        onPointerEnter={() => setHover(true)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <motion.div
          className="photo"
          style={{ rotateX, rotateY }}
          animate={{ scale: hover ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            style={{ position: "absolute", inset: "-5%", x: imgX, y: imgY }}
            animate={{ scale: hover ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <Image
              src="/triciclo_retro.webp"
              alt="Niño en triciclo retro"
              fill
              priority
              sizes="(max-width: 768px) 70vw, 30vw"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
