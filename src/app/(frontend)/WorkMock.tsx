import { IBM_Plex_Serif, Space_Grotesk } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import type { ProjectPreview } from "./content";
import styles from "./work-mock.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-dignition",
  weight: ["500", "700"],
});
const plexSerif = IBM_Plex_Serif({ subsets: ["latin"], variable: "--font-nalar", weight: "300" });

function Layer({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <div
      className={`${styles.layer} ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

const WAFFLE_CELLS = 200;
const WAFFLE_PRESENT = 156;

function SieraMock() {
  return (
    <div className={`${styles.art} ${styles.siera}`}>
      <Layer className={styles.sieraMain} delay={100}>
        <div className={styles.sieraHead}>
          <p className={styles.sieraTitle}>Kehadiran mahasiswa baru</p>
          <p className={styles.sieraSelect}>PATRIBERA Day 1 ⌄</p>
          <p className={styles.sieraLink}>Lihat ›</p>
        </div>
        <div className={styles.sieraBody}>
          <div className={styles.sieraStat}>
            <p className={styles.sieraPercent}>78%</p>
            <p className={styles.sieraMuted}>3.304 dari 4.236 hadir</p>
          </div>
          <div className={styles.waffle}>
            {Array.from({ length: WAFFLE_CELLS }, (_, index) => {
              const column = Math.floor(index / 5);
              return (
                <span
                  className={styles.cell}
                  data-on={column * 5 + (index % 5) < WAFFLE_PRESENT ? "" : undefined}
                  key={index}
                  style={{ "--d": `${500 + column * 22}ms` } as CSSProperties}
                />
              );
            })}
          </div>
        </div>
        <p className={styles.sieraLegend}>
          <span className={styles.dotGreen} /> Hadir 3.304 <span className={styles.dotYellow} />{" "}
          Belum 932 <span className={styles.sieraMuted}>1 kotak ≈ 21 mahasiswa</span>
        </p>
        {[
          ["PATRIBERA Day 1", "3.304 hadir dari 4.236 mahasiswa", 78],
          ["Upacara Pembukaan", "4.102 hadir dari 4.236 mahasiswa", 97],
        ].map(([name, detail, percent]) => (
          <div className={styles.sieraRow} key={name}>
            <div>
              <p className={styles.sieraRowName}>{name}</p>
              <p className={styles.sieraMuted}>{detail}</p>
            </div>
            <span className={styles.sieraBar}>
              <span style={{ width: `${percent}%` }} />
            </span>
            <p className={styles.sieraRowName}>{percent}%</p>
          </div>
        ))}
      </Layer>

      <Layer className={styles.sieraKpi} delay={260}>
        <span className={styles.sieraIcon}>▤</span>
        <p className={styles.sieraKpiValue}>31</p>
        <p className={styles.sieraRowName}>Menunggu dicek</p>
        <p className={styles.sieraMuted}>Pengumpulan tugas</p>
        <p className={styles.sieraKpiLink}>Tinjau penugasan ›</p>
      </Layer>

      <Layer className={styles.sieraGroups} delay={420}>
        <p className={styles.sieraTitle}>Kelompok perlu dikejar</p>
        {[
          ["61", "14 dari 26 terkumpul", "12 belum"],
          ["3", "17 dari 25 terkumpul", "8 belum"],
          ["22", "19 dari 24 terkumpul", "5 belum"],
        ].map(([group, detail, pending]) => (
          <div className={styles.sieraGroup} key={group}>
            <span className={styles.sieraBadge}>{group}</span>
            <div>
              <p className={styles.sieraRowName}>Kelompok {group}</p>
              <p className={styles.sieraMuted}>{detail}</p>
            </div>
            <span className={styles.sieraPill}>{pending}</span>
          </div>
        ))}
      </Layer>
    </div>
  );
}

const CALENDAR: [number, string[]][] = [
  [27, []],
  [28, []],
  [29, []],
  [30, []],
  [1, ["a"]],
  [2, ["e", "a"]],
  [3, ["a", "v"]],
  [4, ["a"]],
  [5, ["e", "a"]],
  [6, ["e", "a"]],
  [7, ["a"]],
  [8, ["a"]],
  [9, ["e", "a"]],
  [10, []],
  [11, []],
  [12, ["e", "a", "s"]],
  [13, ["e", "a"]],
  [14, ["s"]],
  [15, ["a", "s"]],
  [16, ["e", "a"]],
  [17, ["a"]],
  [18, ["s"]],
  [19, ["e", "a"]],
  [20, []],
  [21, []],
  [22, []],
  [23, ["r", "s"]],
  [24, ["r", "s"]],
  [25, ["s"]],
  [26, ["e", "s"]],
  [27, ["s"]],
  [28, ["s"]],
  [29, []],
  [30, []],
  [31, []],
];

function DignitionMock() {
  return (
    <div className={`${styles.art} ${styles.dignition} ${spaceGrotesk.variable}`}>
      <Layer className={styles.digClubs} delay={100}>
        <p className={styles.digHead}>
          Active Study Clubs <span className={styles.digLink}>See all</span>
        </p>
        {[
          ["Android Development", "Android", "2", "31"],
          ["Backend Basic", "Backend", "1", "30"],
          ["UI/UX Basic", "UI/UX", "1", "24"],
          ["Frontend Web", "Frontend", "2", "28"],
        ].map(([name, track, mentors, mentees], index) => (
          <div className={styles.digRow} data-active={index === 0 ? "" : undefined} key={name}>
            <span className={styles.digBook}>▯</span>
            <div>
              <p className={styles.digName}>{name}</p>
              <p className={styles.digMuted}>{track}</p>
            </div>
            <p className={styles.digMuted}>
              {mentors} Mentor · {mentees} Mentee
            </p>
            <span className={styles.digGo}>›</span>
          </div>
        ))}
      </Layer>

      <Layer className={styles.digKpi} delay={260}>
        <span className={styles.digTile}>◍</span>
        <div>
          <p className={styles.digMuted}>Mentee</p>
          <p className={styles.digValue}>743</p>
        </div>
      </Layer>

      <Layer className={styles.digCalendar} delay={420}>
        <div className={styles.digCalHead}>
          <span className={styles.digNav}>‹</span>
          <p className={styles.digName}>October 2026</p>
          <span className={styles.digNav}>›</span>
        </div>
        <div className={styles.digGrid}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <span className={styles.digWeekday} key={day}>
              {day}
            </span>
          ))}
          {CALENDAR.map(([day, dots], index) => (
            <span
              className={styles.digDay}
              data-muted={index < 4 ? "" : undefined}
              data-today={day === 29 && index > 4 ? "" : undefined}
              key={index}
            >
              {day}
              <span className={styles.digDots}>
                {dots.map((dot, dotIndex) => (
                  <i data-tone={dot} key={dotIndex} />
                ))}
              </span>
            </span>
          ))}
        </div>
      </Layer>
    </div>
  );
}

function ThyaMock() {
  return (
    <div className={`${styles.art} ${styles.thya}`}>
      <Layer className={styles.thyaPanel} delay={100}>
        <div className={styles.thyaChat}>
          <div className={styles.thyaBar}>
            <span className={styles.thyaAvatar}>T</span>
            <div>
              <p className={styles.thyaName}>Thya</p>
              <p className={styles.thyaMuted}>online</p>
            </div>
          </div>
          <div className={styles.thyaMessages}>
            <Layer className={styles.thyaOut} delay={420}>
              Untung minggu ini berapa?
            </Layer>
            <Layer className={styles.thyaIn} delay={700}>
              Untung minggu ini <b>Rp 4,2 jt</b>, naik 8% dari minggu lalu.
              <span className={styles.thyaMuted}>Paling banyak dari Es Kopi Susu, 312 gelas.</span>
            </Layer>
            <Layer className={styles.thyaOut} delay={980}>
              Menu apa yang paling laku minggu ini?
            </Layer>
            <Layer className={styles.thyaTyping} delay={1200}>
              <i />
              <i />
              <i />
            </Layer>
          </div>
        </div>
      </Layer>

      <Layer className={styles.thyaEngine} delay={260}>
        <p className={styles.thyaEngineHead}>
          Thya <span>Thya engine</span>
        </p>
        {[
          ["Shop words", "Omzet, margin and HPP in your terms"],
          ["Calculated by code", "Numbers are never guessed by the AI"],
          ["Checked before sending", "Every figure traced to the records"],
        ].map(([title, detail]) => (
          <div className={styles.thyaEngineRow} key={title}>
            <p>{title}</p>
            <p>{detail}</p>
          </div>
        ))}
      </Layer>

      <Layer className={styles.thyaChip} delay={420}>
        ✓ Numbers checked · Sources shown
      </Layer>
    </div>
  );
}

const BARS = [62, 70, 66, 74, 71, 68, 41];

function NalarMock() {
  return (
    <div className={`${styles.art} ${styles.nalar} ${plexSerif.variable}`}>
      <Layer className={styles.nalarCard} delay={100}>
        <p className={styles.nalarMeta}>Nalar · CEO Agent</p>
        <p className={styles.nalarAsk}>Why did revenue drop this week?</p>
        <p className={styles.nalarAnswer}>Revenue fell Rp 67 jt, mostly from returns.</p>
        <p className={styles.nalarBody}>
          Returns at SHP-STORE-02 rose to 3.1%, twice last week&apos;s rate.
        </p>
        <div className={styles.nalarChart}>
          {BARS.map((height, index) => (
            <span
              data-last={index === BARS.length - 1 ? "" : undefined}
              key={index}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <p className={styles.nalarSources}>
          <span>sales_orders · 214 rows</span>
          <span>returns · 38 rows</span>
        </p>
      </Layer>

      <Layer className={styles.nalarKpi} delay={260}>
        <p>Revenue · this week</p>
        <p className={styles.nalarKpiValue}>Rp 184.000.000</p>
        <p className={styles.nalarDelta}>−Rp 67 jt vs last week</p>
      </Layer>

      <Layer className={styles.nalarReturn} delay={420}>
        <p className={styles.nalarReturnLabel}>Return rate</p>
        <p className={styles.nalarReturnValue}>3.1%</p>
        <p className={styles.nalarReturnStore}>SHP-STORE-02</p>
      </Layer>
    </div>
  );
}

const mocks: Record<ProjectPreview, () => ReactNode> = {
  dignition: DignitionMock,
  nalarx: NalarMock,
  siera: SieraMock,
  thya: ThyaMock,
};

export function WorkMock({ preview }: { preview: ProjectPreview }) {
  const Mock = mocks[preview];
  return (
    <div aria-hidden="true" className={styles.stage} data-preview={preview}>
      <Mock />
    </div>
  );
}
