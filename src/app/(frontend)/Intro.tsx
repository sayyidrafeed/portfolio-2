"use client";

import { useEffect, useRef, useState } from "react";

import { GlassSurface } from "./glassyui/glass-surface";
import styles from "./intro.module.css";
import { INTRO_STORAGE_KEY } from "./intro-gate";

const GREETINGS = ["hello", "halo", "hola", "bonjour", "こんにちは", "hello"];
const WORD_MS = 620;
const HOLD_MS = 900;
const LEAVE_MS = 820;

type Phase = "showing" | "leaving" | "done";

export function Intro() {
  const [phase, setPhase] = useState<Phase>("showing");
  const [index, setIndex] = useState(0);
  const timers = useRef<number[]>([]);
  const leaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro")) {
      setPhase("done");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(window.setTimeout(callback, delay));
    };
    const clear = () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };

    const finish = () => {
      try {
        window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Private mode can refuse storage; the intro simply plays again next time.
      }
      root.removeAttribute("data-intro");
      setPhase("done");
    };

    const leave = () => {
      clear();
      setPhase("leaving");
      schedule(finish, reducedMotion ? 300 : LEAVE_MS);
    };
    leaveRef.current = leave;

    if (reducedMotion) {
      setIndex(GREETINGS.length - 1);
      schedule(leave, HOLD_MS + 600);
    } else {
      GREETINGS.forEach((_, step) => {
        if (step > 0) schedule(() => setIndex(step), step * WORD_MS);
      });
      schedule(leave, (GREETINGS.length - 1) * WORD_MS + HOLD_MS);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") leave();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clear();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={styles.intro} data-leaving={phase === "leaving" ? "" : undefined}>
      <div aria-hidden="true" className={styles.backdrop}>
        <GlassSurface className={styles.card} preset="showcase">
          <span className={styles.words}>
            {GREETINGS.map((word, step) => (
              <span
                className={styles.word}
                data-state={step < index ? "past" : step === index ? "active" : "next"}
                key={`${word}-${step}`}
              >
                {word}
              </span>
            ))}
          </span>
        </GlassSurface>
      </div>
      <button className={styles.skip} onClick={() => leaveRef.current()} type="button">
        Skip intro <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
