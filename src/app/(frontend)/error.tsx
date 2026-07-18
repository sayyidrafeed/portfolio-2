"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main>
      <section>
        <p>Application error</p>
        <h1>Something went wrong</h1>
        <button onClick={reset} type="button">
          Try again
        </button>
      </section>
    </main>
  );
}
