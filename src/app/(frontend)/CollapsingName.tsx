"use client";

import { useEffect, useRef } from "react";

import styles from "./page.module.css";

const DOCK_TOP = 18;
const OPTICAL_INDENT = -0.04;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function CollapsingName({ id, name }: { id: string; name: string }) {
  const slotRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const title = titleRef.current;
    const shade = shadeRef.current;
    if (!slot || !title || !shade) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let startX = 0;
    let startY = 0;
    let fontSize = 1;
    let dockScale = 1;
    let frame = 0;

    const render = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrolled / Math.max(1, startY - DOCK_TOP)));
      const eased = easeInOutCubic(progress);
      const scale = 1 + (dockScale - 1) * eased;
      const x = startX + OPTICAL_INDENT * fontSize * scale;
      const y = Math.max(DOCK_TOP, startY - scrolled);
      title.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      shade.style.opacity = String(eased);
    };

    const measure = () => {
      const rect = slot.getBoundingClientRect();
      startX = rect.left;
      startY = rect.top + window.scrollY;
      fontSize = Number.parseFloat(getComputedStyle(title).fontSize);
      dockScale = (window.innerWidth < 760 ? 20 : 24) / fontSize;
      render();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    title.dataset.docking = "";
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      delete title.dataset.docking;
      title.style.transform = "";
    };
  }, []);

  return (
    <div className={styles.nameSlot} ref={slotRef}>
      <h1 className={styles.heroTitle} id={id} ref={titleRef}>
        {name}
      </h1>
      <div aria-hidden="true" className={styles.dockShade} ref={shadeRef} />
    </div>
  );
}
