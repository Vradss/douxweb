"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const TEXT = "Coming soon";

/** Desplazamiento máximo de las filas de atrás (no salen de pantalla). */
const SHIFT = 11; // % del ancho de la fila (≈ vw)

/** Desplazamiento máximo de la foto, en sentido contrario al mouse. */
const PHOTO_SHIFT = 24; // px

export default function ComingSoon() {
  // Posición del cursor en la pantalla, normalizada (-0.5 … 0.5).
  // Centro de la pantalla = 0 → todo alineado.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smooth = { stiffness: 50, damping: 20, mass: 1 };
  const sx = useSpring(mx, smooth);
  const sy = useSpring(my, smooth);

  // Filas de atrás: arriba y abajo se mueven en sentidos opuestos → diagonal
  const topX = useTransform(sx, [-0.5, 0.5], [`-${SHIFT}%`, `${SHIFT}%`]);
  const bottomX = useTransform(sx, [-0.5, 0.5], [`${SHIFT}%`, `-${SHIFT}%`]);

  // Foto: se desplaza al contrario del mouse (sin 3D ni zoom)
  const photoX = useTransform(sx, [-0.5, 0.5], [PHOTO_SHIFT, -PHOTO_SHIFT]);
  const photoY = useTransform(sy, [-0.5, 0.5], [PHOTO_SHIFT, -PHOTO_SHIFT]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

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

      <div className="photo-wrap">
        <motion.div
          className="photo"
          style={{ x: photoX, y: photoY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/triciclo_retro.webp"
            alt="Niño en triciclo retro"
            fill
            priority
            sizes="(max-width: 768px) 70vw, 30vw"
          />
        </motion.div>
      </div>
    </>
  );
}
