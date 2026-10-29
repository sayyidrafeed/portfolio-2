import { CollapsingName } from "./CollapsingName";
import { ChannelIcon } from "./ChannelIcon";
import { channelTargetProps, channels, profile, projects } from "./content";
import { FoldOrb } from "./FoldOrb";
import { Intro } from "./Intro";
import { LiquidStage } from "./LiquidStage";
import styles from "./page.module.css";
import { SiteMenu } from "./SiteMenu";
import { WorkSteps } from "./WorkSteps";

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
              <a className={styles.footerLink} href={channel.href} {...channelTargetProps(channel)}>
                <ChannelIcon platform={channel.platform} />
                {channel.label}
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
