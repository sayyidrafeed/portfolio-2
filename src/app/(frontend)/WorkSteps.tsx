"use client";

import { useEffect, useRef, useState } from "react";

import type { Project } from "./content";
import styles from "./page.module.css";
import { StackGooFilter, StackIcons } from "./StackIcons";
import { WorkMock } from "./WorkMock";

export function WorkSteps({ projects }: { projects: Project[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [motion, setMotion] = useState(false);
  const [live, setLive] = useState<ReadonlySet<number>>(new Set());
  const [active, setActive] = useState(0);

  useEffect(() => {
    const steps = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!steps) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotion(!reducedMotion);

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.step);
          setLive((current) => new Set(current).add(index));
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.2 },
    );
    const focus = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((step) => {
      reveal.observe(step);
      focus.observe(step);
    });

    return () => {
      reveal.disconnect();
      focus.disconnect();
    };
  }, []);

  return (
    <div className={styles.workGrid} data-motion={motion ? "" : undefined}>
      <StackGooFilter />
      <div className={styles.workMargin}>
        <h2 className={styles.label} id="work-title">
          Selected work
        </h2>
        <p aria-hidden="true" className={styles.workKicker}>
          {projects.map((project, index) => (
            <span data-on={index === active ? "" : undefined} key={project.name}>
              {project.name}
            </span>
          ))}
        </p>
      </div>

      <ol className={styles.steps} ref={listRef}>
        {projects.map((project, index) => {
          const number = String(index + 1).padStart(2, "0");
          return (
            <li
              className={styles.step}
              data-live={live.has(index) ? "" : undefined}
              data-step={index}
              key={project.name}
            >
              <div className={styles.stepCopy}>
                <span aria-hidden="true" className={styles.stepNumber}>
                  <span className={styles.numberSharp}>{number}</span>
                  <span className={styles.numberSmear}>{number}</span>
                </span>
                <h3 className={styles.stepTitle}>{project.name}</h3>
                <p className={styles.stepSummary}>{project.summary}</p>
                <StackIcons items={project.stack} />
                <a
                  className={styles.projectLink}
                  href={project.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit {project.name} <span aria-hidden="true">↗</span>
                </a>
              </div>

              <WorkMock preview={project.preview} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
