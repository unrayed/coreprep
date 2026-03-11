import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/sign-in");
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Espace app</h1>
      <p>Bienvenue {data.user.email}</p>
      <form action="/auth/sign-out" method="post">
        <button type="submit">Se déconnecter</button>
      </form>
    </main>
  );
}
