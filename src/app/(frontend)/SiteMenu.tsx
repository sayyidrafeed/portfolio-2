"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { ChannelIcon } from "./ChannelIcon";
import { type Channel, channelTargetProps } from "./content";
import styles from "./page.module.css";

const ITEM_HEIGHT = 44;
const PANEL_PADDING = 10;
const CLOSED_SIZE = 29;

export function SiteMenu({ channels }: { channels: Channel[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelHeight = channels.length * ITEM_HEIGHT + PANEL_PADDING;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      className={styles.menu}
      data-open={open ? "" : undefined}
      ref={rootRef}
      style={
        {
          "--panel-h": `${panelHeight}px`,
          "--panel-sy": CLOSED_SIZE / panelHeight,
        } as CSSProperties
      }
    >
      <svg aria-hidden="true" className={styles.gooDefs} focusable="false">
        <filter height="160%" id="menu-goo" width="160%" x="-30%" y="-30%">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="7" />
          <feColorMatrix
            in="blur"
            result="goo"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div aria-hidden="true" className={styles.gooLayer}>
        <span className={styles.gooTrigger} />
        <span className={styles.gooPanel}>
          <span className={styles.gooPanelFill} />
        </span>
      </div>

      <button
        aria-controls="site-menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className={styles.menuTrigger}
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        <span aria-hidden="true" className={styles.menuIcon} />
      </button>

      <nav aria-label="Channels" className={styles.menuPanel} id="site-menu" inert={!open}>
        <ul>
          {channels.map((channel, index) => (
            <li
              key={channel.platform}
              style={{ transitionDelay: open ? `${60 + index * 30}ms` : "0ms" }}
            >
              <a
                href={channel.href}
                {...channelTargetProps(channel)}
                onClick={() => setOpen(false)}
                title={channel.label}
              >
                <ChannelIcon platform={channel.platform} />
                <span className={styles.menuLabel}>{channel.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
