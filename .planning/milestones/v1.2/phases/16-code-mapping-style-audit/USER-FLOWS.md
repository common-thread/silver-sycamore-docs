# User Flows and Navigation Map

**Created:** 2026-01-17
**Purpose:** Document navigation structure and user flows from user perspective to architecture

---

## Navigation Hierarchy

### Primary Navigation (Header.tsx)

```
Silver Sycamore Staff Hub
├── Home (/)
│   └── Staff Dashboard - InitiativesTable, CategoryGrid
├── Services (/services)
│   ├── Wedding Packages (/services/wedding-packages)
│   ├── Event Packages (/services/event-packages)
│   ├── Catering (/services/catering)
│   └── Add-ons (/services/add-ons)
├── Clients (/clients)                    ⚠️ MISLEADING: Contains client-related forms, not client list
│   ├── Booking (/clients/booking)
│   ├── Planning (/clients/planning)
│   ├── Day Of (/clients/day-of)
│   └── Layouts (/clients/layouts)
├── Staff (/staff)
│   └── Staff category documents
├── Operations (/operations)
│   └── Operations category documents
├── Deliverables (/deliverables)
│   └── Deliverables category documents
├── Messages (/messages)
│   ├── Channel List (sidebar - ChannelList.tsx)
│   └── Channel View (/messages/[channelId])
├── Forms (/forms)
│   ├── Form List
│   ├── New Form (/forms/new)
│   ├── Edit Form (/forms/[formId]/edit)
│   └── Submissions (/forms/[formId]/submissions)
└── My Workspace (/workspace)
    ├── Personal Documents
    ├── Document Editor (/workspace/[docId])
    └── Shared With Me (/workspace/shared)
```

### Secondary Navigation / Actions

```
Header Actions (right side):
├── SearchBar - Global document search
├── NotificationBell - User notifications (@mentions, DMs)
└── UserMenu - Profile, sign out

Document Actions (per-document):
├── Suggest Edit → /suggestions/new?documentId={id}
├── Copy to Workspace → FolderPicker modal
├── Version History → VersionHistory panel toggle
└── Comments → CommentSection (signed-in users)
```

---

## Route Catalog

| Route | Component | Purpose | Content Type | Data Dependencies |
|-------|-----------|---------|--------------|-------------------|
| `/` | `page.tsx` | Staff dashboard | Dashboard | InitiativesTable, CategoryGrid |
| `/services` | `services/page.tsx` | Services index | Category listing | documents.byCategory |
| `/clients` | `clients/page.tsx` | Client forms/docs | Category listing | documents.byCategory |
| `/staff` | `staff/page.tsx` | Staff documents | Category listing | documents.byCategory |
| `/operations` | `operations/page.tsx` | Operations docs | Category listing | documents.byCategory |
| `/deliverables` | `deliverables/page.tsx` | Deliverables | Category listing | documents.byCategory |
| `/catalog` | `catalog/page.tsx` | Document catalog | Document listing | documents.list |
| `/[category]/[slug]` | `[category]/[slug]/page.tsx` | Document viewer | Markdown/Binary | documents.bySlug |
| `/[category]/[slug]/versions/[version]` | `versions/[version]/page.tsx` | Version viewer | Version diff | versions.* |
| `/messages` | `messages/page.tsx` | Messages hub | Messaging | - |
| `/messages/[channelId]` | `messages/[channelId]/page.tsx` | Channel view | Chat messages | messages.listMessages |
| `/forms` | `forms/page.tsx` | Form management | Form listing | forms.list |
| `/forms/new` | `forms/new/page.tsx` | Create form | Form builder | forms.create |
| `/forms/[formId]/edit` | `forms/[formId]/edit/page.tsx` | Edit form | Form builder | forms.get |
| `/forms/[formId]/submissions` | `forms/[formId]/submissions/page.tsx` | View submissions | Submission list | forms.getSubmissions |
| `/forms/submissions` | `forms/submissions/page.tsx` | All submissions | Submission list | forms.getAllSubmissions |
| `/f/[formId]` | `f/[formId]/page.tsx` | Public form | Form renderer | forms.getByFormId |
| `/workspace` | `workspace/page.tsx` | Personal docs | Document list | personalDocuments.list |
| `/workspace/[docId]` | `workspace/[docId]/page.tsx` | Edit personal doc | Editor | personalDocuments.get |
| `/workspace/shared` | `workspace/shared/page.tsx` | Shared with me | Shared docs | folderShares.* |
| `/suggestions` | `suggestions/page.tsx` | My suggestions | Suggestion list | suggestions.byAuthor |
| `/suggestions/new` | `suggestions/new/page.tsx` | Create suggestion | Suggestion form | documents.byId |
| `/suggestions/[id]` | `suggestions/[id]/page.tsx` | View suggestion | Suggestion detail | suggestions.byId |
| `/suggestions/review` | `suggestions/review/page.tsx` | Review queue | Pending list | suggestions.pending |
| `/suggestions/review/[id]` | `suggestions/review/[id]/page.tsx` | Review suggestion | Review form | suggestions.byId |
| `/signin` | `signin/page.tsx` | Authentication | Sign in form | Clerk auth |
| `/style-guide` | `style-guide/page.tsx` | Design system | Style reference | - |
| `/components` | `components/page.tsx` | Component showcase | UI components | - |

---

## User Journey Diagrams

### Journey 1: Browse Documentation

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Home      │────▶│  Category Page  │────▶│  Document View   │
│   (/)       │     │ (/services)     │     │ (/services/slug) │
└─────────────┘     └─────────────────┘     └──────────────────┘
      │                     │                        │
      │                     │                        ▼
      │                     │               ┌──────────────────┐
      │                     │               │  DocumentViewer  │
      │                     │               │  - Markdown      │
      │                     │               │  - Binary docs   │
      │                     │               └──────────────────┘
      │                     │                        │
      ▼                     │                        ▼
┌─────────────┐             │               ┌──────────────────┐
│ CategoryGrid│             │               │   User Actions   │
│  - Browse   │             │               │  - Suggest Edit  │
│  - Quick    │             │               │  - Copy to WS    │
│    access   │             │               │  - Comment       │
└─────────────┘             │               │  - View History  │
                            │               └──────────────────┘
                            │
                            ▼
                    ┌─────────────────┐
                    │  DocumentList   │
                    │  - By category  │
                    │  - By subcategory│
                    └─────────────────┘
```

**Components involved:**
- `CategoryGrid.tsx` - Dashboard category navigation
- `DocumentList.tsx` - Lists documents by category/subcategory
- `DocumentViewer.tsx` - Renders markdown content or binary file indicator
- `Breadcrumb.tsx` - Navigation trail
- `CommentSection.tsx` - Document discussion
- `VersionHistory.tsx` - Version tracking

**Data flow:**
1. User lands on `/` → renders `CategoryGrid` with categories
2. Clicks category → `/[category]` → `DocumentList` with `documents.byCategory`
3. Clicks document → `/[category]/[slug]` → `documents.bySlug` → `DocumentViewer`

---

### Journey 2: Create and Manage Forms

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Forms     │────▶│   FormBuilder   │────▶│   Form List      │
│   (/forms)  │     │ (/forms/new)    │     │  (Published)     │
└─────────────┘     └─────────────────┘     └──────────────────┘
      │                     │                        │
      ▼                     ▼                        ▼
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ forms.list  │     │   FieldEditor   │     │  Share Form      │
│ - My forms  │     │   - Add field   │     │  - Copy link     │
│ - Status    │     │   - Field types │     │  - Send to email │
└─────────────┘     │   - Validation  │     └──────────────────┘
                    └─────────────────┘              │
                            │                        ▼
                            ▼               ┌──────────────────┐
                    ┌─────────────────┐     │  /f/[formId]     │
                    │  forms.create   │     │  FormRenderer    │
                    │  forms.update   │     │  (Public access) │
                    └─────────────────┘     └──────────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  Submissions     │
                                            │  (/forms/[id]/   │
                                            │   submissions)   │
                                            └──────────────────┘
```

**Components involved:**
- `FormBuilder.tsx` - Create/edit forms with field management
- `FieldEditor.tsx` - Configure individual form fields
- `FormRenderer.tsx` - Display form for submission
- `FormShareDialog.tsx` - Share form via link or email
- `SubmissionViewer.tsx` - View submission data

**Data flow:**
1. User visits `/forms` → `forms.list` → form cards
2. Create new → `/forms/new` → `FormBuilder` → `forms.create`
3. Publish → `forms.publish` → share via `FormShareDialog`
4. External user → `/f/[formId]` → `forms.getByFormId` → `FormRenderer`
5. Submission → `forms.submit` → staff views at `/forms/[id]/submissions`

---

### Journey 3: Team Messaging

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Messages   │────▶│   ChannelList   │────▶│   MessageList    │
│ (/messages) │     │   (sidebar)     │     │ (/messages/[id]) │
└─────────────┘     └─────────────────┘     └──────────────────┘
      │                     │                        │
      ▼                     ▼                        ▼
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Create      │     │ channels.list   │     │ messages.list    │
│ Channel     │     │ - Public        │     │ MessageInput     │
│ (dialog)    │     │ - Private       │     │ - Send message   │
└─────────────┘     │ - DMs           │     │ - @mentions      │
      │             └─────────────────┘     │ - File attach    │
      ▼                                     └──────────────────┘
┌─────────────┐                                      │
│ Start DM    │                                      ▼
│ (dialog)    │                             ┌──────────────────┐
└─────────────┘                             │   Notifications  │
                                            │   - @mentions    │
                                            │   - DM alerts    │
                                            └──────────────────┘
```

**Components involved:**
- `ChannelList.tsx` - Sidebar channel navigation
- `CreateChannelDialog.tsx` - Create public/private channels
- `StartDMDialog.tsx` - Start direct message
- `MessageList.tsx` - Display channel messages
- `MessageItem.tsx` - Individual message with actions
- `MessageInput.tsx` - Compose messages with mentions
- `MentionInput.tsx` - @mention autocomplete
- `NotificationBell.tsx` - Notification indicator
- `NotificationInbox.tsx` - View notifications

**Data flow:**
1. User visits `/messages` → layout renders `ChannelList`
2. Select channel → `/messages/[channelId]` → `messages.listMessages`
3. Send message → `messages.send` → real-time update via Convex
4. @mention → `notifications.create` → recipient's `NotificationBell`

---

### Journey 4: Personal Workspace

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Workspace  │────▶│ PersonalDocList │────▶│ PersonalDocEditor│
│ (/workspace)│     │ - Documents     │     │ (/workspace/[id])│
└─────────────┘     │ - Folders       │     └──────────────────┘
      │             └─────────────────┘              │
      │                     │                        ▼
      ▼                     ▼               ┌──────────────────┐
┌─────────────┐     ┌─────────────────┐     │ personalDocs.*   │
│ Create Doc  │     │ FolderTree      │     │ - get            │
│ Button      │     │ - Navigation    │     │ - update         │
└─────────────┘     │ - Organization  │     │ - delete         │
      │             └─────────────────┘     └──────────────────┘
      ▼                     │
┌─────────────┐             ▼
│personalDocs │     ┌─────────────────┐
│ .create     │     │ Shared With Me  │
└─────────────┘     │ (/workspace/    │
                    │  shared)        │
                    └─────────────────┘
```

**Components involved:**
- `PersonalDocList.tsx` - List personal documents
- `PersonalDocEditor.tsx` - Edit personal documents
- `FolderTree.tsx` - Folder navigation/organization
- `FolderPicker.tsx` - Select folder for document
- `ShareDialog.tsx` - Share documents/folders

**Data flow:**
1. User visits `/workspace` → `personalDocuments.list`
2. Create document → `personalDocuments.create` → navigate to `/workspace/[id]`
3. Edit → `personalDocuments.update`
4. Share → `folderShares.create` → appears in recipient's `/workspace/shared`

---

### Journey 5: Document Suggestions (PR-style edits)

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Document View  │────▶│  SuggestionForm │────▶│  Pending Review  │
│ "Suggest Edit"  │     │ (/suggestions/  │     │ (suggestions.*)  │
│                 │     │  new)           │     │                  │
└─────────────────┘     └─────────────────┘     └──────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌─────────────────┐     ┌──────────────────┐
                        │ suggestions.    │     │ SuggestionReview │
                        │ create          │     │ (/suggestions/   │
                        │ - Title edit    │     │  review/[id])    │
                        │ - Content edit  │     │ - Approve        │
                        │ - Change note   │     │ - Reject         │
                        └─────────────────┘     └──────────────────┘
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │ If approved:     │
                                                │ documents.update │
                                                │ → New version    │
                                                └──────────────────┘
```

**Components involved:**
- `SuggestionForm.tsx` - Create/edit suggestions
- `SuggestionList.tsx` - List user's suggestions or pending queue
- `SuggestionDiff.tsx` - Show changes between versions
- `SuggestionReview.tsx` - Review interface for approvers

**Data flow:**
1. From document → `/suggestions/new?documentId={id}`
2. Load original → `documents.byId` → edit in `SuggestionForm`
3. Submit → `suggestions.create` (status: draft/pending)
4. Reviewer → `/suggestions/review/[id]` → `suggestions.byId`
5. Approve → `suggestions.approve` → `documents.update` → new version created

---

## Identified Pain Points

### From STATE.md Backlog

1. **"Clients" navigation misleading** - Nav item labeled "Clients" contains client-related forms (booking, planning, day-of), not an actual client list. Users expect to see clients but find forms.

2. **Blind markdown conversion** - Documents render markdown headers verbatim, causing duplicate titles (e.g., h1 in markdown + title from metadata).

3. **No semantic formatting** - All markdown rendered identically regardless of content type (procedures vs reference vs forms).

4. **Missing progressive disclosure** - Long documents lack accordions or collapsible sections.

5. **Redundant content** - Some forms exist as both markdown documents AND in form builder.

6. **No content type decisions** - Documents don't have designated purpose (form vs editable doc vs static reference).

### From Navigation Analysis

7. **Category pages are static** - Subcategory lists hardcoded in page.tsx files, not dynamic.

8. **Search is content-only** - SearchBar searches document content but doesn't filter by category/type.

9. **No cross-feature navigation** - Can't link directly from document to related form, or from form to source document.

10. **Messages layout inconsistent** - /messages uses a sidebar layout different from other pages.

---

## Architecture Notes

### App Shell Structure (layout.tsx)

```
ConvexAuthNextjsServerProvider
└── html
    └── body
        └── ConvexClientProvider
            └── div.min-h-screen.flex.flex-col
                ├── Header
                │   ├── Brand bar (logo, search, notifications, user)
                │   └── Nav bar (9 items)
                ├── main (flex-1, max-width: 1200px)
                │   └── {children} (page content)
                └── footer
```

### Key Provider Hierarchy

1. `ConvexAuthNextjsServerProvider` - Server-side auth
2. `ConvexClientProvider` - Client-side Convex connection
3. Clerk auth (`useAuth`, `UserButton`) - User authentication

### Route Pattern Summary

| Pattern | Example | Handler |
|---------|---------|---------|
| Static | `/forms` | Direct page.tsx |
| Dynamic segment | `/forms/[formId]/edit` | Param extraction |
| Catch-all category | `/[category]/[slug]` | Category + slug lookup |
| Public route | `/f/[formId]` | No auth required |

---

*User Flows: 2026-01-17*
*Phase: 16-code-mapping-style-audit*
