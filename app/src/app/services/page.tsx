"use client";

import ContextCatalog from "@/components/ContextCatalog";

export default function ServicesPage() {
  return (
    <ContextCatalog
      title="Services"
      description="Packages, menus, and pricing information for all venue offerings"
      categories={["services"]}
    />
  );
}
