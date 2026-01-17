"use client";

import PageHeader from "@/components/PageHeader";
import { ContentBox } from "@/components/ContentBox";
import { ActivityDashboard } from "@/components/ActivityDashboard";

export default function ActivityPage() {
  return (
    <>
      <PageHeader
        title="Activity History"
        description="Track your completed procedures, checklists, and form submissions"
      />
      <ContentBox>
        <ActivityDashboard />
      </ContentBox>
    </>
  );
}
