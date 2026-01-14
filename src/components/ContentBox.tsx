export function ContentBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded p-6 mb-6"
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      {children}
    </div>
  );
}
