import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { layoutStyles } from "./styles";

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <section style={layoutStyles.card}>
      <h2 style={{ marginTop: 0 }}>Bienvenue {data.user?.email}</h2>
      <p style={{ color: "#5b6374" }}>
        Choisissez une option pour commencer votre session de révision.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/app/pratique" style={{ ...layoutStyles.button, textDecoration: "none" }}>
          Pratiquer un QCM
        </Link>
        <Link href="/app/historique" style={{ ...layoutStyles.buttonSecondary, textDecoration: "none" }}>
          Voir l'historique
        </Link>
      </div>
    </section>
  );
}
