"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the site header's current visible height in real time.
 *
 * The header is a `fixed` element that slides itself away on scroll-down
 * and back on scroll-up (see components/Header.tsx), and its own height
 * varies with the dismissible announcement banner. Reading its live
 * bounding box (rather than re-deriving the same scroll-direction logic
 * here) keeps any sticky element positioned directly under it in both
 * states without the two ever drifting out of sync.
 */
export function useHeaderOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    let frame: number;

    const measure = () => {
      const rect = header.getBoundingClientRect();
      // bottom <= 0 means the header is fully translated off-screen.
      setOffset(Math.max(0, rect.bottom));
      frame = requestAnimationFrame(measure);
    };

    frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, []);

  return offset;
}
