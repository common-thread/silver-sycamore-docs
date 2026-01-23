"use client";

import ContextCatalog from "@/components/ContextCatalog";

export default function WikiPage() {
    return (
        <ContextCatalog
            title="Documentation Wiki"
            description="Centralized knowledge base for Silver Sycamore operations, services, and events."
            categories={["packages-menus", "planning-layouts", "operations", "staff"]}
        />
    );
}
