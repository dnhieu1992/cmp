import styles from './page.module.css';
import { getHealth } from '../lib/api';

export default async function Home() {
  const health = await getHealth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.kicker}>CMP Platform</p>
          <h1>Next.js web, NestJS API</h1>
          <p className={styles.subtitle}>
            A clean scaffold with typed health checks, ready for real features.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="/docs">
              Start building
            </a>
            <a className={styles.secondary} href="/status">
              View status
            </a>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>API status</h2>
            <p className={styles.muted}>
              {health
                ? `Healthy • ${health.timestamp}`
                : 'Unavailable • Start the API to see status'}
            </p>
          </article>
          <article className={styles.card}>
            <h2>Routes</h2>
            <p className={styles.muted}>
              API prefix: <code>/api</code> with <code>/api/health</code> ready.
            </p>
          </article>
          <article className={styles.card}>
            <h2>Next steps</h2>
            <p className={styles.muted}>
              Add modules to <code>apps/api/src</code> and pages to{' '}
              <code>apps/web/src/app</code>.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
