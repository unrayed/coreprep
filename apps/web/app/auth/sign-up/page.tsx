import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";

async function signUp(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return redirect(`/auth/sign-up?message=${encodeURIComponent(error.message)}`);
  }

  return redirect("/app");
}

export default function SignUpPage({
  searchParams
}: {
  searchParams?: { message?: string };
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Créer un compte</h1>
      <p>Inscrivez-vous pour accéder à Coreprep.</p>
      {searchParams?.message ? (
        <p style={{ color: "crimson" }}>{searchParams.message}</p>
      ) : null}
      <form action={signUp} style={{ display: "grid", gap: "1rem", maxWidth: 360 }}>
        <label>
          Email
          <input name="email" type="email" required style={{ width: "100%" }} />
        </label>
        <label>
          Mot de passe
          <input name="password" type="password" required style={{ width: "100%" }} />
        </label>
        <button type="submit">Créer un compte</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Déjà un compte ? <a href="/auth/sign-in">Se connecter</a>
      </p>
    </main>
  );
}
