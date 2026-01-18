# Phase 20: Dynamic Content System - Research

**Researched:** 2026-01-17
**Domain:** Convex-based completion tracking, activity feeds, and shareable links
**Confidence:** HIGH

<research_summary>
## Summary

Phase 20 is a **commodity domain** — the patterns are well-established web application features that don't require specialized ecosystem research. The codebase already has strong foundations to build on.

**Key findings:**
1. The existing `personalDocuments.sourceDocumentId` pattern is the correct foundation for template instances
2. Convex's real-time nature makes activity feeds trivial — just query the table
3. Anonymous/public access for shareable links requires the Anonymous provider from Convex Auth
4. Step-level completion is a standard schema extension (array of step states)

**Primary recommendation:** Build on existing schema patterns. Add `dynamicContentInstances` table linking to source documents, with completion state stored as JSON. Activity history is just another table with real-time queries. External sharing uses Convex Anonymous provider.
</research_summary>

<standard_stack>
## Standard Stack

This phase uses **existing project stack** — no new libraries required.

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Convex | current | Backend + real-time database | Already in use, handles real-time automatically |
| @convex-dev/auth | current | Authentication | Already in use, has Anonymous provider |
| Next.js 15 | current | Frontend framework | Already in use |
| React | 18+ | UI components | Already in use |

### Supporting (Already Available)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zustand | if needed | Client state | Complex multi-step form state (probably not needed) |

### No New Dependencies Required
This phase extends existing patterns rather than introducing new technology. Convex's built-in features handle:
- Real-time updates (automatic with queries)
- Data persistence (standard tables)
- Authentication/authorization (existing patterns)

**Installation:** None required.
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Schema Extension
```
convex/
├── schema.ts              # Add dynamicContentInstances, activityLog
├── dynamicContent.ts      # New: Instance creation, completion tracking
├── activity.ts            # New: Activity feed queries
└── sharing.ts             # New: Share link generation, anonymous access
```

### Pattern 1: Template + Instance Model
**What:** Wiki documents serve as templates, users create personal instances
**When to use:** Any document that needs completion tracking
**Example:**
```typescript
// Schema addition
dynamicContentInstances: defineTable({
  // Source template
  sourceDocumentId: v.id("documents"),
  sourceType: v.union(
    v.literal("procedure"),
    v.literal("checklist"),
    v.literal("form")
  ),

  // Owner
  userId: v.optional(v.id("users")), // null for anonymous
  sessionId: v.optional(v.string()), // for anonymous users

  // Completion state
  status: v.union(
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("submitted")
  ),
  completionData: v.string(), // JSON: step states, form values
  completedSteps: v.optional(v.number()), // Quick access to progress
  totalSteps: v.optional(v.number()),

  // Metadata
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  submittedTo: v.optional(v.array(v.id("users"))), // Who receives results
})
.index("by_source", ["sourceDocumentId"])
.index("by_user", ["userId"])
.index("by_user_source", ["userId", "sourceDocumentId"])
.index("by_session", ["sessionId"])
```

### Pattern 2: Activity Log for History
**What:** Single table tracking all user activity for dashboard + sidebar
**When to use:** Activity history display
**Example:**
```typescript
activityLog: defineTable({
  userId: v.id("users"),

  // What happened
  type: v.union(
    v.literal("procedure_started"),
    v.literal("procedure_completed"),
    v.literal("checklist_completed"),
    v.literal("form_submitted"),
    v.literal("form_received") // Someone submitted to this user
  ),

  // References
  instanceId: v.optional(v.id("dynamicContentInstances")),
  documentId: v.optional(v.id("documents")),
  formSubmissionId: v.optional(v.id("formSubmissions")),

  // Context
  title: v.string(), // Denormalized for display
  fromUserId: v.optional(v.id("users")), // Who triggered (for received items)

  // Timestamps
  createdAt: v.number(),
})
.index("by_user", ["userId"])
.index("by_user_recent", ["userId", "createdAt"])
.index("by_type", ["type"])
```

### Pattern 3: Shareable Links with Anonymous Access
**What:** Generate links that allow completion without login
**When to use:** External sharing of checklists/forms
**Example:**
```typescript
shareLinks: defineTable({
  // What's being shared
  documentId: v.id("documents"),

  // Link configuration
  shareToken: v.string(), // Random token for URL
  shareType: v.union(v.literal("internal"), v.literal("external")),

  // Access control
  createdBy: v.id("users"),
  sharedWithUserIds: v.optional(v.array(v.id("users"))), // Internal shares
  routeResultsTo: v.array(v.id("users")), // Who gets submissions

  // Expiration (optional)
  expiresAt: v.optional(v.number()),
  maxUses: v.optional(v.number()),
  useCount: v.number(),

  // Metadata
  createdAt: v.number(),
})
.index("by_token", ["shareToken"])
.index("by_document", ["documentId"])
.index("by_creator", ["createdBy"])
```

### Anti-Patterns to Avoid
- **Storing completion state in document content:** Mixes template with instance data
- **Separate tables per content type:** Creates unnecessary complexity; use single `dynamicContentInstances` with `sourceType` discriminator
- **Polling for updates:** Convex handles real-time automatically; just use queries
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Real-time updates | WebSocket server | Convex queries | Automatic real-time built in |
| Anonymous sessions | Custom token system | Convex Anonymous provider | Handles session management |
| Form submission routing | Custom queue | Existing `formSubmissions.routeToUserIds` | Pattern already exists |
| Step progress calculation | Per-render computation | Denormalized `completedSteps`/`totalSteps` | Performance at scale |
| Share link tokens | Custom crypto | `crypto.randomUUID()` | Built-in, secure |

**Key insight:** This project already has excellent patterns in `formSubmissions` and `personalDocuments`. Extend rather than reinvent.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Over-fetching Activity Data
**What goes wrong:** Loading full activity history slows dashboard
**Why it happens:** No pagination/limits on activity queries
**How to avoid:** Index by `[userId, createdAt]`, use `.take(limit)`, implement cursor pagination
**Warning signs:** Slow initial load, growing response sizes

### Pitfall 2: Step State Drift
**What goes wrong:** `completedSteps` count doesn't match actual completion data
**Why it happens:** Updating JSON separately from counter
**How to avoid:** Single mutation that updates both atomically
**Warning signs:** Progress bar shows wrong percentage

### Pitfall 3: Anonymous Session Leakage
**What goes wrong:** Anonymous users can access each other's data
**Why it happens:** Querying by sourceDocumentId without session filter
**How to avoid:** Always filter by `sessionId` for anonymous, `userId` for authenticated
**Warning signs:** Users seeing others' completion progress

### Pitfall 4: Missing Authorization on Share Links
**What goes wrong:** Internal share links accessible externally
**Why it happens:** Not checking `shareType` before allowing anonymous access
**How to avoid:** Explicit check: `if (link.shareType === "external" || userIsInSharedList)`
**Warning signs:** Security audit failures

### Pitfall 5: Form vs Instance Confusion
**What goes wrong:** Forms use one system, procedures/checklists use another
**Why it happens:** Building separately instead of unified schema
**How to avoid:** All dynamic content goes through `dynamicContentInstances`
**Warning signs:** Duplicate code for similar features
</common_pitfalls>

<code_examples>
## Code Examples

### Starting a Procedure Instance
```typescript
// convex/dynamicContent.ts
export const startProcedure = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity ? await getUserId(ctx) : null;

    const doc = await ctx.db.get(documentId);
    if (!doc || doc.contentType !== "procedure") {
      throw new Error("Invalid document");
    }

    // Parse steps from content (markdown headers or structured data)
    const steps = parseStepsFromContent(doc.content);

    const instanceId = await ctx.db.insert("dynamicContentInstances", {
      sourceDocumentId: documentId,
      sourceType: "procedure",
      userId,
      sessionId: identity?.sessionId, // For anonymous
      status: "in_progress",
      completionData: JSON.stringify({ steps: steps.map(() => false) }),
      completedSteps: 0,
      totalSteps: steps.length,
      startedAt: Date.now(),
    });

    // Log activity
    if (userId) {
      await ctx.db.insert("activityLog", {
        userId,
        type: "procedure_started",
        instanceId,
        documentId,
        title: doc.title,
        createdAt: Date.now(),
      });
    }

    return instanceId;
  },
});
```

### Completing a Step
```typescript
export const completeStep = mutation({
  args: {
    instanceId: v.id("dynamicContentInstances"),
    stepIndex: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, { instanceId, stepIndex, completed }) => {
    const instance = await ctx.db.get(instanceId);
    if (!instance) throw new Error("Instance not found");

    // Authorization check
    await verifyInstanceAccess(ctx, instance);

    // Update completion data atomically
    const data = JSON.parse(instance.completionData);
    data.steps[stepIndex] = completed;

    const completedSteps = data.steps.filter(Boolean).length;
    const isFullyComplete = completedSteps === instance.totalSteps;

    await ctx.db.patch(instanceId, {
      completionData: JSON.stringify(data),
      completedSteps,
      status: isFullyComplete ? "completed" : "in_progress",
      completedAt: isFullyComplete ? Date.now() : undefined,
    });

    // Log completion if done
    if (isFullyComplete && instance.userId) {
      await ctx.db.insert("activityLog", {
        userId: instance.userId,
        type: "procedure_completed",
        instanceId,
        documentId: instance.sourceDocumentId,
        title: (await ctx.db.get(instance.sourceDocumentId))?.title ?? "",
        createdAt: Date.now(),
      });
    }
  },
});
```

### Activity Feed Query
```typescript
// convex/activity.ts
export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    // Real-time: Convex auto-updates when activity changes
    const activities = await ctx.db
      .query("activityLog")
      .withIndex("by_user_recent", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return activities;
  },
});
```

### Shareable Link Access
```typescript
// convex/sharing.ts
export const accessViaShareLink = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const link = await ctx.db
      .query("shareLinks")
      .withIndex("by_token", (q) => q.eq("shareToken", token))
      .first();

    if (!link) return { error: "Link not found" };
    if (link.expiresAt && link.expiresAt < Date.now()) {
      return { error: "Link expired" };
    }
    if (link.maxUses && link.useCount >= link.maxUses) {
      return { error: "Link usage limit reached" };
    }

    const identity = await ctx.auth.getUserIdentity();

    // Check access
    if (link.shareType === "internal") {
      if (!identity) return { error: "Login required" };
      const userId = await getUserId(ctx);
      if (!link.sharedWithUserIds?.includes(userId)) {
        return { error: "Access denied" };
      }
    }

    const document = await ctx.db.get(link.documentId);
    return { document, link };
  },
});
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Polling for updates | Convex real-time queries | N/A (always was) | Just use queries, no setup |
| Custom anonymous tokens | Convex Anonymous provider | Available now | Add to auth.ts providers |
| Separate activity services | Single activityLog table | N/A | Convex handles real-time |

**New tools/patterns to consider:**
- **Convex Components:** Pre-built patterns for common features (push notifications, streaming)
- **Better Auth integration:** If moving to Better Auth later, note anonymous bug (Nov 2025)

**Deprecated/outdated:**
- None applicable — Convex patterns are stable
</sota_updates>

<open_questions>
## Open Questions

1. **Step Parsing Strategy**
   - What we know: Documents have markdown content with headers
   - What's unclear: Best way to identify "steps" in existing content
   - Recommendation: Use h2/h3 headers as step boundaries, or add structured step data field

2. **Manager Approval Workflow**
   - What we know: Templates should support "requires sign-off" flag
   - What's unclear: Exact approval UI/notification flow
   - Recommendation: Add `requiresApproval` to document metadata, build approval queue in Phase 21+

3. **Anonymous Session Tracking**
   - What we know: Convex Anonymous provider creates sessions
   - What's unclear: How to link anonymous completions to user if they later sign up
   - Recommendation: Store sessionId, add migration mutation for account linking
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Codebase exploration: `app/convex/schema.ts` — existing table definitions
- Codebase exploration: `app/convex/personalDocuments.ts` — sourceDocumentId pattern
- Codebase exploration: `app/convex/forms.ts` — routing patterns
- [Convex Auth Anonymous Users](https://labs.convex.dev/auth/config/anonymous) — anonymous provider setup

### Secondary (MEDIUM confidence)
- [Convex Real-time Docs](https://docs.convex.dev/realtime) — auto-subscription behavior
- [Convex Authorization Best Practices](https://stack.convex.dev/authorization) — security patterns

### Tertiary (LOW confidence - needs validation)
- None — all patterns verified against official docs
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Convex schema extensions
- Ecosystem: None needed (using existing stack)
- Patterns: Template/instance, activity feeds, share links
- Pitfalls: Authorization, data consistency, performance

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies
- Architecture: HIGH — extends existing patterns
- Pitfalls: HIGH — common Convex patterns
- Code examples: HIGH — based on existing codebase patterns

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days — patterns are stable)
</metadata>

---

*Phase: 20-dynamic-content-system*
*Research completed: 2026-01-17*
*Ready for planning: yes*
