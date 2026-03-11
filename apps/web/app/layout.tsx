import type { ReactNode } from "react";

export const metadata = {
  title: "Coreprep",
  description: "Exam-prep for Morocco"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
