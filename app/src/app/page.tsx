import { InitiativesTable } from "@/components/InitiativesTable";
import { QuickActionNav } from "@/components/QuickActionNav";
import { ContentBox } from "@/components/ContentBox";

export default function Home() {
  return (
    <>
      <ContentBox>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-semibold)",
            marginBottom: "var(--space-2)",
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
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-semibold)",
            marginBottom: "var(--space-5)",
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
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-semibold)",
            marginBottom: "var(--space-5)",
            color: "var(--color-ink)",
          }}
        >
          Quick Actions
        </h2>
        <QuickActionNav />
      </ContentBox>
    </>
  );
}
