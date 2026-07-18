import Link from "next/link";
import type { Route } from "next";

export default function HomePage() {
  return (
    <main>
      <section aria-labelledby="scaffold-title">
        <p>Foundation ready</p>
        <h1 id="scaffold-title">Portfolio scaffold</h1>
        <p>
          The application, content studio, database adapter, media pipeline, and deployment boundary
          are ready for a future design direction.
        </p>
        <Link href={"/studio" as Route}>Open Payload Studio</Link>
      </section>
    </main>
  );
}
