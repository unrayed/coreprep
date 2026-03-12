import type { ReactNode } from "react";

export const metadata = {
  title: {
    default: "Coreprep – Révision Concours Maroc",
    template: "%s | Coreprep"
  },
  description:
    "Préparez les concours marocains avec des QCM interactifs. Entraînez-vous, suivez vos progrès et progressez à votre rythme.",
  metadataBase: new URL("https://coreprep.ma")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "#f6f7fb",
          color: "#1f2430"
        }}
      >
        {children}
      </body>
    </html>
  );
}
