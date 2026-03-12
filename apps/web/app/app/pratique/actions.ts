"use server";

import { createClient } from "../../../lib/supabase/server";

export type SubmitState = {
  status: "idle" | "error" | "success";
  message?: string;
  isCorrect?: boolean;
  correctChoiceId?: string;
  chosenChoiceId?: string;
};

export async function submitQcmAttempt(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const supabase = await createClient();
  const itemId = String(formData.get("item_id") ?? "");
  const chosenChoiceId = String(formData.get("choice_id") ?? "");
  const durationMsRaw = formData.get("duration_ms");
  const durationMs = durationMsRaw ? Number(durationMsRaw) : null;

  if (!itemId || !chosenChoiceId) {
    return {
      status: "error",
      message: "Veuillez sélectionner une réponse."
    };
  }

  const { data, error } = await supabase.rpc("submit_qcm_attempt", {
    p_item_id: itemId,
    p_chosen_choice_id: chosenChoiceId,
    p_duration_ms: Number.isFinite(durationMs) ? durationMs : null
  });

  if (error || !data) {
    return {
      status: "error",
      message: error?.message ?? "Une erreur est survenue."
    };
  }

  return {
    status: "success",
    isCorrect: Boolean(data.is_correct),
    correctChoiceId: data.correct_choice_id,
    chosenChoiceId
  };
}
