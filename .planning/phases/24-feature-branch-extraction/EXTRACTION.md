# Feature Extraction Inventory

**Purpose:** Document exactly what will be removed from main and how to restore it.

**Branch for restoration:** `feature/full-v1`

## Features Being Extracted

- **Messaging system** - channels, DMs, notifications
- **Forms builder** - form creation, field management, submissions
- **Comments system** - threaded comments on documents
- **Interactive content features** - procedure stepping, checklist completion
- **Activity dashboard and sidebar** - activity tracking UI

## Files to Remove (by feature)

### Messaging

**Routes:**
- `app/src/app/messages/` (entire directory)
  - `layout.tsx`
  - `page.tsx`
  - `[channelId]/page.tsx`

**Components:**
- `app/src/components/ChannelList.tsx`
- `app/src/components/MessageList.tsx`
- `app/src/components/MessageItem.tsx`
- `app/src/components/MessageInput.tsx`
- `app/src/components/CreateChannelDialog.tsx`
- `app/src/components/StartDMDialog.tsx`
- `app/src/components/NotificationBell.tsx`
- `app/src/components/NotificationInbox.tsx`
- `app/src/components/FileAttachment.tsx`

### Forms Builder

**Routes:**
- `app/src/app/forms/` (entire directory)
  - `page.tsx`
  - `new/page.tsx`
  - `[formId]/edit/page.tsx`
  - `[formId]/submissions/page.tsx`
  - `submissions/page.tsx`

**Components:**
- `app/src/components/FormBuilder.tsx`
- `app/src/components/FieldEditor.tsx`
- `app/src/components/DraggableFieldCard.tsx`
- `app/src/components/FormShareDialog.tsx`
- `app/src/components/SubmissionViewer.tsx`
- `app/src/components/FormRenderer.tsx` (keep for form display if needed)

### Comments

**Components:**
- `app/src/components/CommentSection.tsx`
- `app/src/components/CommentItem.tsx`
- `app/src/components/MentionInput.tsx`

### Interactive Content / Activity

**Routes:**
- `app/src/app/activity/page.tsx`
- `app/src/app/procedures/page.tsx` (optional - filtered document list)
- `app/src/app/checklists/page.tsx` (optional - filtered document list)

**Components:**
- `app/src/components/ProcedureSteps.tsx`
- `app/src/components/ChecklistView.tsx`
- `app/src/components/ActivityDashboard.tsx`
- `app/src/components/ActivitySidebar.tsx`

## What Stays

**Core wiki system:**
- Wiki document routes (`/guides`, `/operations`, `/procedures`, `/references`, `/services`)
- Document viewing and browsing
- Search functionality
- Navigation components

**Workspace:**
- Personal workspace (`/workspace`)
- Personal document editing
- Folder management

**Versioning:**
- Document version history
- Version comparison
- Version badges

**User system:**
- User profiles and auth system (with toggle)
- Staff directory
- User picker/search

**Content display:**
- ContentTypeRenderer (read-only display)
- DocumentViewer
- DocumentList
- CategoryGrid/Nav
- Breadcrumb

**Backend:**
- All Convex schema tables (non-breaking, can be unused)
- All Convex functions (can be unused, no build errors)

## Restoration Path

To restore all features:

```bash
# 1. Merge feature branch back to main
git checkout main
git merge feature/full-v1

# 2. Enable authentication
# In app/.env.local:
NEXT_PUBLIC_ENABLE_AUTH=true

# 3. Verify build
cd app && bun run build
```

## Connectors

When removing features, mark connection points in code with comments:

```typescript
// CONNECTOR: messaging - restore from feature/full-v1
// Component: NotificationBell in Header.tsx

// CONNECTOR: forms-builder - restore from feature/full-v1
// Route: /forms navigation link

// CONNECTOR: comments - restore from feature/full-v1
// Component: CommentSection in DocumentViewer.tsx

// CONNECTOR: activity - restore from feature/full-v1
// Component: ActivitySidebar in layout
```

## Navigation Links to Remove

Update navigation when extracting features:

- Remove "Messages" nav link
- Remove "Forms" nav link
- Remove "Activity" nav link
- Keep all wiki category links (Guides, Operations, Procedures, References, Services)

## Extraction Order (Recommended)

1. Comments (fewest dependencies)
2. Activity dashboard/sidebar
3. Messaging (standalone feature)
4. Forms builder (standalone feature)
5. Interactive content (ProcedureSteps, ChecklistView)

---

*Created: 2026-01-18*
*Branch: feature/full-v1 preserves all features*
