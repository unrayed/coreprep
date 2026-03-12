import { createClient } from "../../../lib/supabase/server";
import PracticeForm from "./PracticeForm";
import { submitQcmAttempt } from "./actions";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  subject: string;
  exam: string;
  year: number | null;
  prompt: string;
};

type Choice = {
  id: string;
  label: string;
  body: string;
};

async function getRandomItem(): Promise<{
  item: Item | null;
  choices: Choice[];
  error?: string;
}> {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true })
    .eq("kind", "qcm");

  if (countError) {
    return { item: null, choices: [], error: countError.message };
  }

  if (!count || count === 0) {
    return {
      item: null,
      choices: [],
      error: "Aucune question QCM disponible pour le moment."
    };
  }

  const randomOffset = Math.floor(Math.random() * count);
  const { data: items, error: itemError } = await supabase
    .from("items")
    .select("id, subject, exam, year, prompt")
    .eq("kind", "qcm")
    .range(randomOffset, randomOffset);

  if (itemError || !items || items.length === 0) {
    return {
      item: null,
      choices: [],
      error: itemError?.message ?? "Impossible de charger la question."
    };
  }

  const item = items[0];

  const { data: choices, error: choiceError } = await supabase
    .from("item_choices")
    .select("id, label, body")
    .eq("item_id", item.id)
    .order("label", { ascending: true });

  if (choiceError) {
    return { item: null, choices: [], error: choiceError.message };
  }

  return {
    item,
    choices: choices ?? []
  };
}

export default async function PracticePage() {
  const { item, choices, error } = await getRandomItem();

  if (error) {
    return (
      <section style={{ padding: "1.5rem" }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(31,36,48,0.08)"
          }}
        >
          <h2>Pratique QCM</h2>
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      </section>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <section>
      <PracticeForm item={item} choices={choices} submitAction={submitQcmAttempt} />
    </section>
  );
}
