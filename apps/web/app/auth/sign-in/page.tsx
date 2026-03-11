import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";

async function signIn(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect(`/auth/sign-in?message=${encodeURIComponent(error.message)}`);
  }

  return redirect("/app");
}

export default function SignInPage({
  searchParams
}: {
  searchParams?: { message?: string };
}) {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Connexion</h1>
      <p>Connectez-vous pour accéder à Coreprep.</p>
      {searchParams?.message ? (
        <p style={{ color: "crimson" }}>{searchParams.message}</p>
      ) : null}
      <form action={signIn} style={{ display: "grid", gap: "1rem", maxWidth: 360 }}>
        <label>
          Email
          <input name="email" type="email" required style={{ width: "100%" }} />
        </label>
        <label>
          Mot de passe
          <input name="password" type="password" required style={{ width: "100%" }} />
        </label>
        <button type="submit">Se connecter</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Pas de compte ? <a href="/auth/sign-up">Créer un compte</a>
      </p>
    </main>
  );
}
