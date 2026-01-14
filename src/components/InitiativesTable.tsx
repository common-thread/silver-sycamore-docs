"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function InitiativesTable() {
  const initiatives = useQuery(api.initiatives.list);

  if (!initiatives) {
    return <div className="text-[#586069]">Loading initiatives...</div>;
  }

  if (initiatives.length === 0) {
    return <div className="text-[#586069]">No initiatives found.</div>;
  }

  const active = initiatives.filter((i) => i.status === "active");
  const completed = initiatives.filter((i) => i.status === "completed");

  return (
    <div>
      {active.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Active Priorities</h3>
          <table className="mb-6">
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Phase</th>
                <th>Next Actions</th>
              </tr>
            </thead>
            <tbody>
              {active.map((i) => (
                <tr key={i._id}>
                  <td>{i.title}</td>
                  <td>{i.phase || "-"}</td>
                  <td>{i.nextActions || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {completed.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Recently Completed</h3>
          <table>
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Completed</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((i) => (
                <tr key={i._id}>
                  <td>{i.title}</td>
                  <td>{i.completedDate || "-"}</td>
                  <td>{i.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
