"use client";

import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";

import type { StackItem } from "./content";
import styles from "./stack-icons.module.css";

const OPEN_DELAY_MS = 180;
const WARM_WINDOW_MS = 400;

export function StackIcons({ items }: { items: StackItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const openRef = useRef<number | null>(null);
  const timer = useRef(0);
  const warmUntil = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Tooltips start at the chip and run right; near the right edge they run left instead.
    const align = () => {
      const limit = document.documentElement.clientWidth - 12;
      for (const item of list.querySelectorAll<HTMLElement>("[data-stack-item]")) {
        const tip = item.querySelector<HTMLElement>("[data-tip]");
        const end = tip ? item.getBoundingClientRect().left + tip.offsetWidth > limit : false;
        item.dataset.align = end ? "end" : "start";
      }
    };
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, [items]);

  const update = (index: number | null) => {
    if (openRef.current !== null && index === null) {
      warmUntil.current = performance.now() + WARM_WINDOW_MS;
    }
    openRef.current = index;
    setOpen(index);
  };

  const show = (index: number) => {
    window.clearTimeout(timer.current);
    // Once one tooltip has been seen, its neighbours open without the delay.
    if (openRef.current !== null || performance.now() < warmUntil.current) {
      update(index);
    } else {
      timer.current = window.setTimeout(() => update(index), OPEN_DELAY_MS);
    }
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    update(null);
  };

  const onPointerEnter = (event: PointerEvent, index: number) => {
    if (event.pointerType === "mouse") show(index);
  };

  return (
    <ul className={styles.list} ref={listRef}>
      {items.map((item, index) => (
        <li
          className={styles.item}
          data-open={open === index ? "" : undefined}
          data-stack-item=""
          key={item.label}
        >
          <span aria-hidden="true" className={styles.goo}>
            <span className={styles.chip} />
            <span className={styles.tipShape}>{item.label}</span>
          </span>
          <button
            aria-label={item.label}
            className={styles.button}
            onBlur={hide}
            onClick={() => (open === index ? hide() : update(index))}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) show(index);
            }}
            onPointerEnter={(event) => onPointerEnter(event, index)}
            onPointerLeave={hide}
            type="button"
          >
            <span
              className={styles.glyph}
              data-keep-color={item.keepColor ? "" : undefined}
              style={{ "--icon": `url(${item.icon})`, "--brand": item.brand } as CSSProperties}
            />
          </button>
          <span aria-hidden="true" className={styles.tip} data-tip="">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StackGooFilter() {
  return (
    <svg aria-hidden="true" className={styles.defs} focusable="false">
      <filter height="200%" id="stack-goo" width="160%" x="-30%" y="-50%">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="4" />
        <feColorMatrix
          in="blur"
          result="goo"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </svg>
  );
}
