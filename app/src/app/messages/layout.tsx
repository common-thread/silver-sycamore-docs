"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ChannelList } from "@/components/ChannelList";
import { CreateChannelDialog } from "@/components/CreateChannelDialog";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Extract channelId from pathname if present
  const channelIdMatch = pathname.match(/\/messages\/([^/]+)/);
  const currentChannelId = channelIdMatch ? channelIdMatch[1] : undefined;

  return (
    <>
      <Breadcrumb categoryName="Messages" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "0",
          alignItems: "stretch",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            background: "var(--color-surface-dim, #F8F8F6)",
            borderRight: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: 0,
              }}
            >
              Messages
            </h2>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              title="Create channel"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                padding: 0,
                fontFamily: "var(--font-body)",
                fontSize: "1.25rem",
                fontWeight: 400,
                color: "var(--color-accent)",
                background: "transparent",
                border: "1px solid var(--color-accent)",
                borderRadius: 0,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent)";
                e.currentTarget.style.color = "var(--color-surface)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-accent)";
              }}
            >
              +
            </button>
          </div>

          {/* Channel list */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <ChannelList currentChannelId={currentChannelId} />
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </div>

      {/* Create channel dialog */}
      <CreateChannelDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
}
