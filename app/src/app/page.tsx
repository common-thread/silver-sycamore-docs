import { InitiativesTable } from "@/components/InitiativesTable";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ContentBox } from "@/components/ContentBox";

export default function Home() {
  return (
    <>
      <ContentBox>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "var(--color-ink)",
          }}
        >
          Staff Dashboard
        </h1>
        <p style={{ color: "var(--color-ink-muted)", margin: 0 }}>
          Internal documentation and project tracking
        </p>
      </ContentBox>

      <ContentBox>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
            color: "var(--color-ink)",
          }}
        >
          Priority Initiatives
        </h2>
        <InitiativesTable />
      </ContentBox>

      <ContentBox>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1.25rem",
            color: "var(--color-ink)",
          }}
        >
          Browse Documents
        </h2>
        <CategoryGrid />
      </ContentBox>
    </>
  );
}
