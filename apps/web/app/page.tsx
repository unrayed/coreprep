import type { CSSProperties } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/server";

export const metadata = {
  title: "Coreprep – Révision Concours Maroc",
  description:
    "Préparez les concours marocains avec des QCM interactifs. Entraînez-vous, suivez vos progrès et progressez à votre rythme."
};

const card: CSSProperties = {
  background: "white",
  borderRadius: 16,
  padding: "2rem",
  boxShadow: "0 10px 30px rgba(31,36,48,0.08)"
};

const btn: CSSProperties = {
  display: "inline-block",
  background: "#1f6feb",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "0.75rem 1.5rem",
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer"
};

const btnOutline: CSSProperties = {
  display: "inline-block",
  background: "white",
  color: "#1f2430",
  border: "1px solid #d0d7de",
  borderRadius: 10,
  padding: "0.75rem 1.5rem",
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer"
};

export default async function HomePage() {
  // Check if user is already logged in to tailor the CTA
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = !!data.user;
  } catch {
    // Not authenticated or Supabase not configured — show public view
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={card}>
          <p
            style={{
              margin: "0 0 0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#3730a3",
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}
          >
            Coreprep
          </p>
          <h1 style={{ margin: "0 0 1rem", fontSize: "2rem", lineHeight: 1.2 }}>
            Révisez les concours marocains, efficacement.
          </h1>
          <p style={{ color: "#5b6374", marginBottom: "2rem" }}>
            QCM interactifs pour les concours des grandes écoles du Maroc
            (ENSA, ENSIAS, etc.). Phase 1 : Concours QCM. BAC prévu bientôt.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {isLoggedIn ? (
              <>
                <Link href="/app/pratique" style={btn}>
                  Pratiquer maintenant
                </Link>
                <Link href="/app/historique" style={btnOutline}>
                  Mon historique
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" style={btn}>
                  Se connecter
                </Link>
                <Link href="/auth/sign-up" style={btnOutline}>
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#8b95a8",
            fontSize: "0.85rem"
          }}
        >
          Gratuit · Données sécurisées · Maroc 🇲🇦
        </p>
      </div>
    </main>
  );
}
