import type { CSSProperties } from "react";

export const layoutStyles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7fb",
    color: "#1f2430",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif"
  } satisfies CSSProperties,
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "1.5rem"
  } satisfies CSSProperties,
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    background: "white",
    borderRadius: 16,
    padding: "1rem 1.5rem",
    boxShadow: "0 10px 30px rgba(31,36,48,0.08)"
  } satisfies CSSProperties,
  nav: {
    display: "flex",
    gap: "1rem",
    fontWeight: 600
  } satisfies CSSProperties,
  main: {
    marginTop: "1.5rem"
  } satisfies CSSProperties,
  card: {
    background: "white",
    borderRadius: 16,
    padding: "1.5rem",
    boxShadow: "0 10px 30px rgba(31,36,48,0.08)"
  } satisfies CSSProperties,
  button: {
    background: "#1f6feb",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "0.75rem 1.25rem",
    fontWeight: 600,
    cursor: "pointer"
  } satisfies CSSProperties,
  buttonSecondary: {
    background: "white",
    color: "#1f2430",
    border: "1px solid #d0d7de",
    borderRadius: 10,
    padding: "0.75rem 1.25rem",
    fontWeight: 600,
    cursor: "pointer"
  } satisfies CSSProperties,
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: 999,
    padding: "0.2rem 0.75rem",
    fontSize: "0.85rem",
    fontWeight: 600
  } satisfies CSSProperties
};
