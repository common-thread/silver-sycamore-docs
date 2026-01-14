"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function InitiativesTable() {
  const initiatives = useQuery(api.initiatives.list);

  if (!initiatives) {
    return (
      <div style={{ color: "var(--color-ink-muted)" }}>
        Loading initiatives...
      </div>
    );
  }

  if (initiatives.length === 0) {
    return (
      <div style={{ color: "var(--color-ink-muted)" }}>
        No initiatives found.
      </div>
    );
  }

  const active = initiatives.filter((i) => i.status === "active");
  const upcoming = initiatives.filter(
    (i) => i.status === "upcoming" || i.status === "planned"
  );
  const completed = initiatives.filter((i) => i.status === "completed");

  return (
    <div>
      {active.length > 0 && (
        <>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            Active
          </h3>
          <table className="mb-8">
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Status</th>
                <th>Next Action</th>
              </tr>
            </thead>
            <tbody>
              {active.map((i) => (
                <tr key={i._id}>
                  <td style={{ fontWeight: 500 }}>{i.title}</td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.phase || "In Progress"}
                  </td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.nextActions || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            Upcoming
          </h3>
          <table className="mb-8">
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Status</th>
                <th>Dependency</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((i) => (
                <tr key={i._id}>
                  <td style={{ fontWeight: 500 }}>{i.title}</td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.phase || "Planned"}
                  </td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.dependency || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            Recently Completed
          </h3>
          <table>
            <thead>
              <tr>
                <th>Deliverable</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((i) => (
                <tr key={i._id}>
                  <td>
                    {i.link ? (
                      <a
                        href={i.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {i.title}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 500 }}>{i.title}</span>
                    )}
                  </td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.completedDate || "—"}
                  </td>
                  <td style={{ color: "var(--color-ink-muted)" }}>
                    {i.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
