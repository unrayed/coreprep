"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitQcmAttempt } from "./actions";
import type { SubmitState } from "./actions";
import { layoutStyles } from "../styles";

const initialState: SubmitState = { status: "idle" };

export type Choice = {
  id: string;
  label: string;
  body: string;
};

export type Item = {
  id: string;
  subject: string;
  exam: string;
  year: number | null;
  prompt: string;
};

type PracticeFormProps = {
  item: Item;
  choices: Choice[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" style={layoutStyles.button} disabled={pending}>
      {pending ? "Envoi en cours…" : "Valider ma réponse"}
    </button>
  );
}

export default function PracticeForm({ item, choices }: PracticeFormProps) {
  const [state, formAction] = useFormState(submitQcmAttempt, initialState);
  const startRef = useRef(Date.now());
  const durationInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
  }, [item.id]);

  const handleSubmit = () => {
    if (durationInputRef.current) {
      durationInputRef.current.value = String(Date.now() - startRef.current);
    }
  };

  const correctChoiceId = state.correctChoiceId;

  return (
    <form action={formAction} onSubmit={handleSubmit} style={layoutStyles.card}>
      <span style={layoutStyles.tag}>QCM</span>
      <h2 style={{ marginTop: "0.75rem" }}>{item.prompt}</h2>
      <p style={{ color: "#5b6374" }}>
        {item.subject} · {item.exam}
        {item.year ? ` · ${item.year}` : ""}
      </p>

      <input type="hidden" name="item_id" value={item.id} />
      <input type="hidden" name="duration_ms" ref={durationInputRef} />

      <div style={{ display: "grid", gap: "0.75rem", marginTop: "1.5rem" }}>
        {choices.map((choice) => {
          const isCorrect = correctChoiceId === choice.id;
          const isChosen = state.chosenChoiceId === choice.id;
          const borderColor = isCorrect
            ? "#22c55e"
            : isChosen
              ? "#ef4444"
              : "#d0d7de";
          const background = isCorrect
            ? "#dcfce7"
            : isChosen
              ? "#fee2e2"
              : "#fff";

          return (
            <label
              key={choice.id}
              style={{
                border: `1px solid ${borderColor}`,
                borderRadius: 12,
                padding: "0.75rem 1rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                background
              }}
            >
              <input
                type="radio"
                name="choice_id"
                value={choice.id}
                disabled={state.status === "success"}
                style={{ marginTop: "0.3rem" }}
              />
              <div>
                <strong>{choice.label}.</strong> {choice.body}
              </div>
            </label>
          );
        })}
      </div>

      {state.status === "error" ? (
        <p style={{ color: "#dc2626", marginTop: "1rem" }}>{state.message}</p>
      ) : null}

      {state.status === "success" ? (
        <div style={{ marginTop: "1.5rem" }}>
          <strong
            style={{
              color: state.isCorrect ? "#15803d" : "#b91c1c",
              fontSize: "1.05rem"
            }}
          >
            {state.isCorrect
              ? "✓ Bonne réponse !"
              : "✗ Réponse incorrecte. La bonne option est surlignée en vert."}
          </strong>
        </div>
      ) : null}

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {state.status !== "success" && <SubmitButton />}
        <a href="/app/pratique" style={{ ...layoutStyles.buttonSecondary, textDecoration: "none" }}>
          {state.status === "success" ? "Question suivante →" : "Autre question"}
        </a>
      </div>
    </form>
  );
}
