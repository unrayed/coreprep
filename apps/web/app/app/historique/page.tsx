import { createClient } from "../../../lib/supabase/server";
import { layoutStyles } from "../styles";

export const dynamic = "force-dynamic";

type AttemptRow = {
  id: string;
  is_correct: boolean;
  created_at: string;
  item: {
    prompt: string;
    subject: string;
    exam: string;
    year: number | null;
  } | null;
  chosen_choice: {
    label: string;
    body: string;
  } | null;
};

export default async function HistoriquePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: attempts, error } = await supabase
    .from("attempts")
    .select(
      "id, is_correct, created_at, item:items(prompt, subject, exam, year), chosen_choice:item_choices(label, body)"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <section style={layoutStyles.card}>
      <h2 style={{ marginTop: 0 }}>Historique de pratique</h2>
      <p style={{ color: "#5b6374" }}>
        Dernières 50 tentatives{authData.user ? ` de ${authData.user.email}` : ""}.
      </p>

      {error ? (
        <p style={{ color: "#b91c1c" }}>
          Impossible de charger l'historique : {error.message}
        </p>
      ) : null}

      {!attempts || attempts.length === 0 ? (
        <p style={{ color: "#5b6374" }}>Aucune tentative enregistrée.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
          {attempts.map((attempt) => {
            const when = new Date(attempt.created_at).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short"
            });
            return (
              <article
                key={attempt.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1rem"
                }}
              >
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={layoutStyles.tag}>{when}</span>
                  <span
                    style={{
                      ...layoutStyles.tag,
                      background: attempt.is_correct ? "#dcfce7" : "#fee2e2",
                      color: attempt.is_correct ? "#15803d" : "#b91c1c"
                    }}
                  >
                    {attempt.is_correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <h3 style={{ margin: "0.75rem 0 0" }}>
                  {attempt.item?.prompt ?? "Question supprimée"}
                </h3>
                <p style={{ color: "#5b6374", marginTop: "0.35rem" }}>
                  {attempt.item
                    ? `${attempt.item.subject} · ${attempt.item.exam}${
                        attempt.item.year ? ` · ${attempt.item.year}` : ""
                      }`
                    : ""}
                </p>
                <p style={{ marginTop: "0.75rem" }}>
                  <strong>Votre réponse :</strong>{" "}
                  {attempt.chosen_choice
                    ? `${attempt.chosen_choice.label}. ${attempt.chosen_choice.body}`
                    : "Aucune"}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
