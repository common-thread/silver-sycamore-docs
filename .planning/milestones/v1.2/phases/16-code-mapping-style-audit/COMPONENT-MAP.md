---
components:
  # Feature Components - Core Business Logic
  - name: DocumentViewer
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [document, fileUrl]
    size: 148
    notes: "Renders markdown via ReactMarkdown or shows pending conversion for binary"

  - name: FormBuilder
    category: feature
    queries: [forms.get]
    mutations: [forms.create, forms.update]
    tables: [formSchemas]
    props: [formId, onSave, onCancel]
    size: 605
    notes: "Create/edit forms with FieldEditor for field management"

  - name: FormRenderer
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [formSchema, onSubmit, isSubmitting]
    size: 510
    notes: "Renders form for submission, handles validation"

  - name: MessageList
    category: feature
    queries: [messages.listMessages, users.getUsersById]
    mutations: []
    tables: [messages, users]
    props: [channelId, currentUserId, userRole, membershipRole, onReply]
    size: 272
    notes: "Displays channel messages with date dividers and @mention resolution"

  - name: MessageItem
    category: feature
    queries: [messages.getThreadMessages, files.getUrl]
    mutations: [messages.editMessage, messages.deleteMessage]
    tables: [messages, files]
    props: [message, currentUserId, userRole, membershipRole, onReply, mentionedUsersMap]
    size: 494
    notes: "Individual message with threading, edit/delete, file attachments"

  - name: ChannelList
    category: feature
    queries: [channels.listUserChannels, messages.getUnreadCount]
    mutations: []
    tables: [channels, channelMembers, messages]
    props: [activeChannelId]
    size: 344
    notes: "Sidebar navigation for channels with unread badges"

  - name: CommentSection
    category: feature
    queries: [comments.byDocument, comments.byPersonalDocument]
    mutations: [comments.add]
    tables: [comments]
    props: [documentId, personalDocumentId]
    size: 202
    notes: "Document discussion with threaded replies"

  - name: CommentItem
    category: feature
    queries: [users.getUsersById]
    mutations: [comments.update, comments.remove]
    tables: [comments, users]
    props: [comment, currentUserId, replies, documentId, personalDocumentId]
    size: 597
    notes: "Individual comment with @mentions, edit/delete"

  - name: SuggestionForm
    category: feature
    queries: [documents.byId, suggestions.byId]
    mutations: [suggestions.create, suggestions.update, suggestions.submit]
    tables: [documents, suggestions]
    props: [documentId, suggestionId]
    size: 465
    notes: "Create/edit document change suggestions"

  - name: SuggestionReview
    category: feature
    queries: [suggestions.getById]
    mutations: [suggestions.approve, suggestions.reject, suggestions.promote]
    tables: [suggestions, documents]
    props: [suggestionId]
    size: 628
    notes: "Review interface for approving/rejecting suggestions"

  - name: SuggestionList
    category: feature
    queries: [suggestions.byAuthor, suggestions.pending]
    mutations: []
    tables: [suggestions]
    props: [mode, authorId]
    size: 328
    notes: "List suggestions by author or pending review"

  # Layout Components - Page Structure
  - name: Header
    category: layout
    queries: []
    mutations: []
    tables: []
    props: []
    size: 154
    notes: "Main navigation with brand bar and nav items"

  - name: PageHeader
    category: layout
    queries: []
    mutations: []
    tables: []
    props: [title, description, breadcrumbs, actions]
    size: 122
    notes: "Page title with breadcrumbs and action buttons"

  - name: ContentBox
    category: layout
    queries: []
    mutations: []
    tables: []
    props: [children]
    size: 16
    notes: "Content wrapper with consistent styling"

  - name: Breadcrumb
    category: layout
    queries: []
    mutations: []
    tables: []
    props: [documentTitle]
    size: 92
    notes: "Navigation breadcrumb trail"

  # UI Primitives - Base Components
  - name: Button
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [variant, size, disabled, children]
    size: 157
    location: ui/Button.tsx
    notes: "Primary, secondary, ghost variants with size options"

  - name: Input
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [type, label, error, disabled]
    size: 138
    location: ui/Input.tsx
    notes: "Form input with label, validation state, focus styles"

  - name: Select
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [options, value, onChange, searchable, label, error]
    size: 590
    location: ui/Select.tsx
    notes: "Custom dropdown with optional search, auto-search for >5 items"

  - name: Badge
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [variant, children]
    size: 98
    location: ui/Badge.tsx
    notes: "Status indicators and labels"

  - name: Card
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [children, onClick]
    size: 212
    location: ui/Card.tsx
    notes: "Clickable content card"

  # Shared Components - Reusable Features
  - name: SearchBar
    category: shared
    queries: []
    mutations: []
    tables: []
    props: []
    size: 126
    notes: "Global search trigger, opens SearchResults"

  - name: SearchResults
    category: shared
    queries: [documents.search]
    mutations: []
    tables: [documents]
    props: [query]
    size: 174
    notes: "Search results display with highlighting"

  - name: CategoryGrid
    category: shared
    queries: [categories.list]
    mutations: []
    tables: [categories]
    props: []
    size: 65
    notes: "Dashboard category navigation grid"

  - name: CategoryNav
    category: shared
    queries: [categories.list, subcategories.byCategorySlug]
    mutations: []
    tables: [categories, subcategories]
    props: [activeCategory, activeSubcategory]
    size: 165
    notes: "Category/subcategory navigation sidebar"

  - name: DocumentList
    category: shared
    queries: [documents.byCategory]
    mutations: []
    tables: [documents]
    props: [category, subcategory]
    size: 35
    notes: "Simple document listing by category"

  - name: RelatedDocs
    category: shared
    queries: [documents.related]
    mutations: []
    tables: [documents]
    props: [documentId, category]
    size: 92
    notes: "Related documents in same category"

  - name: InitiativesTable
    category: shared
    queries: [initiatives.list]
    mutations: []
    tables: [initiatives]
    props: []
    size: 132
    notes: "Priority initiatives dashboard table"

  - name: VersionHistory
    category: shared
    queries: [versions.listByDocument]
    mutations: []
    tables: [documentVersions]
    props: [documentId, category, slug, currentVersion]
    size: 214
    notes: "Document version history with diff links"

  - name: VersionBadge
    category: shared
    queries: []
    mutations: []
    tables: []
    props: [version, onClick]
    size: 47
    notes: "Clickable version indicator"

  # Dialog Components - Modals and Overlays
  - name: CreateChannelDialog
    category: dialog
    queries: []
    mutations: [channels.createChannel]
    tables: [channels]
    props: [isOpen, onClose]
    size: 426
    notes: "Create public/private channel"

  - name: StartDMDialog
    category: dialog
    queries: []
    mutations: [channels.findOrCreateDM]
    tables: [channels]
    props: [isOpen, onClose]
    size: 181
    notes: "Start direct message conversation"

  - name: ShareDialog
    category: dialog
    queries: [folderShares.listByFolder]
    mutations: [folderShares.share, folderShares.revoke]
    tables: [folderShares, shareGroups]
    props: [folderId, isOpen, onClose]
    size: 444
    notes: "Share folder with users/groups"

  - name: FormShareDialog
    category: dialog
    queries: [forms.getSends]
    mutations: [forms.sendForm]
    tables: [formSchemas, formSends]
    props: [formId, formSchemaId, formTitle, isOpen, onClose]
    size: 557
    notes: "Share published form via link or email"

  - name: FolderPicker
    category: dialog
    queries: [personalFolders.listAll]
    mutations: []
    tables: [personalFolders]
    props: [title, onSelect, onCancel]
    size: 217
    notes: "Select folder for document organization"

  # Input Components - Specialized Inputs
  - name: FieldEditor
    category: input
    queries: []
    mutations: []
    tables: []
    props: [field, existingFieldNames, onSave, onCancel]
    size: 513
    notes: "Form field configuration editor"

  - name: MentionInput
    category: input
    queries: [users.search]
    mutations: []
    tables: [users]
    props: [value, onChange, placeholder, disabled]
    size: 344
    notes: "@mention autocomplete input"

  - name: MessageInput
    category: input
    queries: []
    mutations: [messages.sendMessage, messages.generateUploadUrl]
    tables: [messages, files]
    props: [channelId, replyTo, onReplyCancel]
    size: 403
    notes: "Message composer with file upload"

  - name: UserPicker
    category: input
    queries: [users.search]
    mutations: []
    tables: [users]
    props: [selectedUsers, onChange, excludeIds, maxUsers, label]
    size: 147
    notes: "Multi-user selection picker"

  - name: UserSearchInput
    category: input
    queries: [users.getCurrentUser, users.search]
    mutations: []
    tables: [users, userProfiles]
    props: [onSelect, excludeUserIds, placeholder]
    size: 248
    notes: "Search and select single user"

  # Personal Workspace Components
  - name: PersonalDocList
    category: feature
    queries: []
    mutations: [personalDocuments.remove]
    tables: [personalDocuments]
    props: [documents]
    size: 204
    notes: "Personal document listing with delete"

  - name: PersonalDocEditor
    category: feature
    queries: []
    mutations: [personalDocuments.update]
    tables: [personalDocuments]
    props: [document]
    size: 183
    notes: "Personal document content editor"

  - name: FolderTree
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [folders, documents, activeFolder, onFolderSelect, onDocSelect]
    size: 184
    notes: "Folder navigation tree"

  # Notification Components
  - name: NotificationBell
    category: feature
    queries: [notifications.getUnreadCount]
    mutations: []
    tables: [notifications]
    props: []
    size: 120
    notes: "Notification indicator with count badge"

  - name: NotificationInbox
    category: feature
    queries: [notifications.listNotifications]
    mutations: [notifications.markAsRead, notifications.markAllAsRead]
    tables: [notifications]
    props: [isOpen, onClose]
    size: 302
    notes: "Notification dropdown/inbox"

  # Submission Components
  - name: SubmissionViewer
    category: feature
    queries: [forms.getSubmission]
    mutations: [forms.deleteSubmission]
    tables: [formSubmissions]
    props: [submissionId, onClose]
    size: 377
    notes: "View form submission data"

  # Suggestion Components
  - name: SuggestionDiff
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [original, suggested]
    size: 159
    notes: "Side-by-side diff comparison"

  # Auth Components
  - name: UserMenu
    category: feature
    queries: []
    mutations: []
    tables: []
    props: []
    size: 63
    notes: "User profile dropdown with sign out"

  # Misc Components
  - name: FileAttachment
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [file, onRemove]
    size: 297
    notes: "File upload/preview component"

  - name: LogoFull
    category: ui-primitive
    queries: []
    mutations: []
    tables: []
    props: [size]
    size: 86
    location: Logo.tsx
    notes: "Full logo lockup - icon + wordmark"

  - name: ConvexClientProvider
    category: provider
    queries: []
    mutations: []
    tables: []
    props: [children]
    size: 17
    notes: "Convex client context provider"

  - name: PermissionGuard
    category: utility
    queries: []
    mutations: []
    tables: []
    props: [children, allowedRoles, fallback]
    size: 38
    notes: "Role-based rendering guard"

  - name: VersionCompare
    category: feature
    queries: []
    mutations: []
    tables: []
    props: [leftVersion, rightVersion]
    size: 161
    notes: "Version comparison view"
---

# Component-to-Data Flow Documentation

**Created:** 2026-01-17
**Purpose:** Map component architecture to data layer for v1.2 planning

---

## Component Inventory by Category

### Feature Components (Core Business Logic)
| Component | Size (LOC) | Data Dependencies | Tables |
|-----------|------------|-------------------|--------|
| SuggestionReview | 628 | suggestions.getById, .approve/.reject/.promote | suggestions, documents |
| FormBuilder | 605 | forms.get, forms.create/update | formSchemas |
| CommentItem | 597 | users.getUsersById, comments.update/remove | comments, users |
| FormShareDialog | 557 | forms.getSends, forms.sendForm | formSchemas, formSends |
| FormRenderer | 510 | - | - |
| MessageItem | 494 | messages.getThreadMessages/edit/delete | messages, files |
| SuggestionForm | 465 | documents.byId, suggestions.* | documents, suggestions |
| SubmissionViewer | 377 | forms.getSubmission/deleteSubmission | formSubmissions |
| ChannelList | 344 | channels.listUserChannels, messages.getUnreadCount | channels, messages |
| SuggestionList | 328 | suggestions.byAuthor/pending | suggestions |
| NotificationInbox | 302 | notifications.list/markAsRead/markAllAsRead | notifications |
| MessageList | 272 | messages.listMessages, users.getUsersById | messages, users |

### UI Primitives (Base Components)
| Component | Size (LOC) | Location | Purpose |
|-----------|------------|----------|---------|
| Select | 590 | ui/Select.tsx | Custom dropdown with search |
| Card | 212 | ui/Card.tsx | Clickable content card |
| Button | 157 | ui/Button.tsx | Primary/secondary/ghost actions |
| Input | 138 | ui/Input.tsx | Form input with validation |
| Badge | 98 | ui/Badge.tsx | Status indicators |

### Layout Components
| Component | Size (LOC) | Purpose |
|-----------|------------|---------|
| Header | 154 | Main navigation |
| PageHeader | 122 | Page title + actions |
| Breadcrumb | 92 | Navigation trail |
| ContentBox | 16 | Content wrapper |

---

## Data Flow Diagrams

### Document Viewing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                            │
│                    /[category]/[slug]                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       page.tsx                                  │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│ │ useQuery        │  │ useMutation     │  │ useState        │ │
│ │ documents.bySlug│  │ personalDocs.   │  │ showHistory     │ │
│ │                 │  │ copyFromWiki    │  │ showFolderPicker│ │
│ └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
└──────────┼────────────────────┼────────────────────┼───────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ documents       │   │ personalDocs    │   │ UI State        │
│ table           │   │ table           │   │ (local)         │
│ ─────────────── │   │ ─────────────── │   │ ─────────────── │
│ title           │   │ ownerId         │   │ Version panel   │
│ slug            │   │ title           │   │ Folder picker   │
│ content         │   │ content         │   │ Copy loading    │
│ category        │   │ sourceDocumentId│   │                 │
│ version         │   │                 │   │                 │
└────────┬────────┘   └─────────────────┘   └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DocumentViewer                               │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Props: document, fileUrl                                    ││
│ │ Renders:                                                    ││
│ │   - Markdown via ReactMarkdown (sourceType=md)             ││
│ │   - Office viewer iframe (sourceType=docx/xlsx)            ││
│ │   - "Pending conversion" card (binary without URL)         ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Form Builder Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       FormBuilder.tsx                           │
│                          (605 LOC)                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├──────────────────────┬─────────────────────────────────┐
         │                      │                                 │
         ▼                      ▼                                 ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────┐
│ useQuery        │   │ useMutation     │   │ Local State         │
│ forms.get       │   │ forms.create    │   │ ───────────────────│
│ (edit mode)     │   │ forms.update    │   │ title, description  │
│                 │   │                 │   │ category, fields[]  │
└────────┬────────┘   └────────┬────────┘   │ editingFieldIndex   │
         │                     │            │ isAddingField       │
         │                     │            └──────────┬──────────┘
         ▼                     │                       │
┌─────────────────┐            │                       ▼
│ formSchemas     │◀───────────┘            ┌─────────────────────┐
│ table           │                         │ FieldEditor         │
│ ─────────────── │                         │ (513 LOC)           │
│ formId          │                         │ ─────────────────── │
│ title           │                         │ Field configuration │
│ description     │                         │ - name, type, label │
│ category        │                         │ - required, options │
│ fields (JSON)   │                         │ - placeholder       │
│ ownerId         │                         └─────────────────────┘
│ isPublished     │
└─────────────────┘
         │
         │ (when published)
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      /f/[formId]                                │
│                    FormRenderer.tsx                             │
│                       (510 LOC)                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Props: formSchema, onSubmit, isSubmitting                   ││
│ │ Parses fields JSON → renders field components               ││
│ │ Validates on submit → calls onSubmit with data              ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ formSubmissions │
│ table           │
│ ─────────────── │
│ formSchemaId    │
│ formId          │
│ data (JSON)     │
│ respondentName  │
│ respondentEmail │
│ submittedAt     │
└─────────────────┘
```

### Messaging Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    /messages/[channelId]                        │
│                    ChannelLayout + Page                         │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         │                                                         │
         ▼                                                         ▼
┌─────────────────────┐                           ┌─────────────────────┐
│ ChannelList (344)   │                           │ MessageList (272)   │
│ ─────────────────── │                           │ ─────────────────── │
│ channels.listUser   │                           │ messages.listMessages│
│ Channels            │                           │ users.getUsersById  │
└─────────┬───────────┘                           └─────────┬───────────┘
          │                                                 │
          ▼                                                 ▼
┌─────────────────┐                               ┌─────────────────┐
│ channels        │                               │ messages        │
│ table           │                               │ table           │
│ ─────────────── │                               │ ─────────────── │
│ name            │                               │ channelId       │
│ type            │                               │ authorId        │
│ description     │                               │ content         │
│ creatorId       │                               │ parentId        │
│ isArchived      │                               │ fileId          │
└─────────────────┘                               │ isEdited        │
                                                  └────────┬────────┘
                                                           │
         ┌─────────────────────────────────────────────────┼───────┐
         │                                                 │       │
         ▼                                                 ▼       ▼
┌─────────────────────┐                   ┌─────────────────┐ ┌─────────┐
│ MessageItem (494)   │                   │ MessageInput    │ │ files   │
│ ─────────────────── │                   │ (403 LOC)       │ │ table   │
│ messages.getThread  │                   │ ─────────────── │ └─────────┘
│ messages.edit/delete│                   │ messages.send   │
│ files.getUrl        │                   │ messages.genUrl │
└─────────────────────┘                   └─────────────────┘
         │
         │ (@mention detected)
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    notifications                                │
│                    table                                        │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ userId, type, channelId, messageId, fromUserId, isRead      ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────┐
│ NotificationBell    │
│ (120 LOC)           │
│ ─────────────────── │
│ notifications.      │
│ getUnreadCount      │
└─────────────────────┘
```

### Suggestion (PR-style Edit) Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Document View                                │
│                 "Suggest Edit" button                           │
└─────────────────────────────────────────────────────────────────┘
         │
         │ /suggestions/new?documentId={id}
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SuggestionForm.tsx (465 LOC)                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ useQuery: documents.byId, suggestions.byId (edit mode)      ││
│ │ useMutation: suggestions.create/update/submit               ││
│ │                                                             ││
│ │ User edits: title, content, changeNote                      ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
         │
         │ suggestions.create (status: "draft")
         │ suggestions.submit (status: "pending")
         ▼
┌─────────────────┐
│ suggestions     │
│ table           │
│ ─────────────── │
│ documentId      │
│ authorId        │
│ status          │◀─── "draft" | "pending" | "approved" | "rejected"
│ title           │
│ content         │
│ changeNote      │
│ reviewedBy      │
│ reviewNote      │
│ appliedAt       │
└────────┬────────┘
         │
         │ (status: "pending")
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                SuggestionReview.tsx (628 LOC)                   │
│                /suggestions/review/[id]                         │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ useQuery: suggestions.getById                               ││
│ │ useMutation: suggestions.approve/reject/promote             ││
│ │                                                             ││
│ │ Displays: SuggestionDiff (159 LOC) for comparison           ││
│ │ Actions: Approve → Promote, or Reject with note             ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
         │
         │ suggestions.promote (if approved)
         ▼
┌─────────────────┐          ┌─────────────────────┐
│ documents       │◀─────────│ documentVersions    │
│ table           │          │ table               │
│ ─────────────── │          │ ─────────────────── │
│ version++       │          │ documentId          │
│ title (updated) │          │ version             │
│ content (updated)│         │ title, content      │
│ updatedAt       │          │ editedBy, editedBy  │
└─────────────────┘          │ Name, changeNote    │
                             └─────────────────────┘
```

### Personal Workspace Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      /workspace                                 │
│                      WorkspacePage                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├──────────────────────────────────────────────────────────┐
         │                                                          │
         ▼                                                          ▼
┌─────────────────────┐                            ┌─────────────────────┐
│ useQuery            │                            │ useMutation         │
│ personalDocuments.  │                            │ personalDocuments.  │
│ list                │                            │ create              │
│ personalFolders.get │                            │                     │
│ personalFolders.    │                            │                     │
│ getPath             │                            │                     │
└─────────┬───────────┘                            └─────────┬───────────┘
          │                                                  │
          ▼                                                  │
┌─────────────────────┐                                      │
│ PersonalDocList     │                                      │
│ (204 LOC)           │                                      │
│ ─────────────────── │                                      │
│ Props: documents    │                                      │
│ personalDocuments.  │                                      │
│ remove              │                                      │
└─────────┬───────────┘                                      │
          │                                                  │
          │ Click document                                   │
          ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    /workspace/[docId]                           │
│                    PersonalDocEditor (183 LOC)                  │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Props: document                                             ││
│ │ personalDocuments.update (auto-save)                        ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐          ┌─────────────────────┐
│ personalDocuments│         │ personalFolders     │
│ table           │          │ table               │
│ ─────────────── │          │ ─────────────────── │
│ ownerId         │          │ ownerId             │
│ title           │◀────────▶│ name                │
│ content         │ folderId │ parentId            │
│ folderId        │          │                     │
│ sourceDocumentId│          │                     │
└─────────────────┘          └─────────────────────┘
                                      │
                                      │ (sharing)
                                      ▼
                             ┌─────────────────────┐
                             │ folderShares        │
                             │ table               │
                             │ ─────────────────── │
                             │ folderId            │
                             │ sharedWithUserId    │
                             │ sharedWithGroupId   │
                             │ permission          │
                             │ sharedBy            │
                             └─────────────────────┘
```

---

## Component-to-Table Mapping

| Table | Components Using It |
|-------|---------------------|
| `documents` | DocumentViewer, DocumentList, SearchResults, RelatedDocs, SuggestionForm, SuggestionReview |
| `documentVersions` | VersionHistory, SuggestionReview (via promote) |
| `categories` | CategoryGrid, CategoryNav |
| `subcategories` | CategoryNav |
| `formSchemas` | FormBuilder, FormRenderer (via page), FormShareDialog |
| `formSubmissions` | SubmissionViewer, forms/submissions pages |
| `formSends` | FormShareDialog |
| `channels` | ChannelList, CreateChannelDialog, StartDMDialog |
| `channelMembers` | ChannelList (implicit via channels.listUserChannels) |
| `messages` | MessageList, MessageItem, MessageInput |
| `files` | MessageItem, FileAttachment |
| `comments` | CommentSection, CommentItem |
| `suggestions` | SuggestionForm, SuggestionList, SuggestionReview, SuggestionDiff |
| `personalDocuments` | PersonalDocList, PersonalDocEditor, workspace pages |
| `personalFolders` | FolderPicker, FolderTree, workspace pages |
| `folderShares` | ShareDialog |
| `shareGroups` | ShareDialog |
| `notifications` | NotificationBell, NotificationInbox |
| `initiatives` | InitiativesTable |
| `users` | MessageList, CommentItem, MentionInput, UserPicker, UserSearchInput |
| `userProfiles` | UserSearchInput, UserMenu |

---

## Fragile Areas (Large Components)

Components over 400 LOC warrant attention for potential refactoring:

| Component | LOC | Concern |
|-----------|-----|---------|
| SuggestionReview | 628 | Complex state + multiple mutations |
| FormBuilder | 605 | Large local state for fields array |
| CommentItem | 597 | Inline editing + threading logic |
| FormShareDialog | 557 | Multiple share methods in one dialog |
| FieldEditor | 513 | Many field type configurations |
| FormRenderer | 510 | Switch statement for all field types |
| MessageItem | 494 | Threading + file attachments + edit/delete |
| SuggestionForm | 465 | Editor state + document loading |
| ShareDialog | 444 | User/group sharing logic |
| CreateChannelDialog | 426 | Form state + validation |
| MessageInput | 403 | File upload + @mentions |

---

*Component Map: 2026-01-17*
*Phase: 16-code-mapping-style-audit*
