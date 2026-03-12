import type { ReactNode } from "react";
import Link from "next/link";
import { layoutStyles } from "./styles";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <section style={layoutStyles.page}>
      <div style={layoutStyles.container}>
        <header style={layoutStyles.header}>
          <div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#5b6374" }}>
              Coreprep • Concours QCM
            </p>
            <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Espace QCM</h1>
          </div>
          <nav style={layoutStyles.nav}>
            <Link href="/app/pratique">Pratiquer</Link>
            <Link href="/app/historique">Historique</Link>
          </nav>
          <form action="/auth/sign-out" method="post">
            <button type="submit" style={layoutStyles.buttonSecondary}>
              Se déconnecter
            </button>
          </form>
        </header>
        <main style={layoutStyles.main}>{children}</main>
      </div>
    </section>
  );
}
