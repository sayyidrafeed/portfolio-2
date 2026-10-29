import type { CSSProperties } from "react";

import { CollapsingName } from "./CollapsingName";
import { ChannelIcon } from "./ChannelIcon";
import { channelTargetProps, channels, profile, projects } from "./content";
import { FoldOrb } from "./FoldOrb";
import { Intro } from "./Intro";
import { LiquidStage } from "./LiquidStage";
import styles from "./page.module.css";
import { SiteMenu } from "./SiteMenu";
import { WorkSteps } from "./WorkSteps";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" focusable="false" height="16" viewBox="0 0 24 24" width="16">
      <path
        d="M7 17 17 7M8.5 7H17v8.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Intro />
      <div aria-hidden="true" className={styles.bottomBlur}>
        {Array.from({ length: 5 }, (_, layer) => (
          <span key={layer} />
        ))}
      </div>
      <SiteMenu channels={channels} />
      <main>
        <section aria-labelledby="hero-title" className={styles.hero} data-liquid-window="smooth">
          <LiquidStage />
          <div className={styles.heroBody}>
            <CollapsingName id="hero-title" name={profile.name} />
            <p className={styles.heroRole}>{profile.tagline}</p>
          </div>
        </section>

        <section aria-labelledby="work-title" className={styles.work} id="work">
          <WorkSteps projects={projects} />
        </section>
      </main>

      <footer className={styles.footer} data-liquid-window="dither" id="contact">
        <FoldOrb />
        <h2 className={styles.footerTitle}>Hit me up.</h2>
        <ul className={styles.footerLinks}>
          {channels.map((channel) => (
            <li key={channel.platform}>
              <a
                aria-label={channel.label}
                className={styles.footerLink}
                href={channel.href}
                {...channelTargetProps(channel)}
              >
                <span aria-hidden="true" className={styles.footerIcon}>
                  <ChannelIcon platform={channel.platform} />
                  <ArrowIcon />
                </span>
                <span aria-hidden="true" className={styles.footerLabel}>
                  {Array.from(channel.label, (char, index) => (
                    <span data-char={char} key={index} style={{ "--i": index } as CSSProperties}>
                      {char}
                    </span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.footerBase}>
          <p className={styles.label}>© 2026 {profile.fullName}</p>
          <p className={styles.label}>
            Orb shader by{" "}
            <a href="https://x.com/XorDev" rel="noreferrer" target="_blank">
              XorDev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
