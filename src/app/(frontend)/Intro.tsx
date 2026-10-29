"use client";

import { useEffect, useState } from "react";

import styles from "./intro.module.css";
import { INTRO_STORAGE_KEY } from "./intro-gate";

const HOLD_MS = 700;
const LEAVE_MS = 820;
const REDUCED_LEAVE_MS = 300;

type Phase = "showing" | "leaving" | "done";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("showing");

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro")) {
      setPhase("done");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => setPhase("leaving"), HOLD_MS);
    const finish = window.setTimeout(
      () => {
        try {
          window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
        } catch {
          // Private mode can refuse storage; the intro simply plays again next time.
        }
        root.removeAttribute("data-intro");
        setPhase("done");
      },
      HOLD_MS + (reducedMotion ? REDUCED_LEAVE_MS : LEAVE_MS),
    );

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(finish);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={styles.intro}
      data-leaving={phase === "leaving" ? "" : undefined}
    />
  );
}
