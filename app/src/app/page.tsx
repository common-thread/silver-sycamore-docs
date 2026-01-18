import { InitiativesTable } from "@/components/InitiativesTable";
import { QuickActionNav } from "@/components/QuickActionNav";
import { ContentBox } from "@/components/ContentBox";

// CONNECTOR: messaging routes - restore from feature/full-v1
// Original location: app/src/app/messages/

// CONNECTOR: activity system - restore from feature/full-v1
// Routes: app/src/app/activity/
// Components: ActivityDashboard, ActivitySidebar

export default function Home() {
  return (
    <>
      <ContentBox>
        <h1 className="page-title">Staff Dashboard</h1>
        <p className="page-subtitle">
          Internal documentation and project tracking
        </p>
      </ContentBox>

      <ContentBox>
        <div className="content-section-header">
          <h2 className="content-section-title">Priority Initiatives</h2>
        </div>
        <InitiativesTable />
      </ContentBox>

      <ContentBox>
        <div className="content-section-header">
          <h2 className="content-section-title">Quick Actions</h2>
        </div>
        <QuickActionNav />
      </ContentBox>
    </>
  );
}
