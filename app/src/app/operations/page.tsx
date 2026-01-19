"use client";

import ContextCatalog from "@/components/ContextCatalog";

export default function OperationsPage() {
  return (
    <ContextCatalog
      title="Operations"
      description="Staff procedures, training materials, and facility management"
      categories={["staff", "operations"]}
    />
  );
}
