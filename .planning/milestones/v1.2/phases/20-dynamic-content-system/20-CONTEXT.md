# Phase 20: Dynamic Content System - Context

**Gathered:** 2026-01-17
**Status:** Ready for planning

<vision>
## How This Should Work

This phase builds the complete infrastructure for "dynamic content" — procedures, checklists, and forms that staff can complete, track, and share. The key insight: these aren't just documents to display differently, they're interactive workflows with a full lifecycle.

**Two patterns coexist:**

1. **Template-Based (Controlled):** Wiki procedures/checklists serve as templates. Managers configure who gets notified, who must approve completions. Staff "use" templates and results flow where the template specifies.

2. **User-Created (Flexible):** Staff can create or duplicate dynamic content in their personal workspace with full control. They decide sharing rules, approval workflows, and result destinations — like creating a Google Form but internal.

**The completion lifecycle:**
```
Template/Document → Personal Instance → Completion/Submission → Activity History
                                              ↓
                                    Notifications + Routing
```

Staff should be able to:
- Complete procedures step-by-step with progress tracking
- Check off checklist items with completion state persisted
- Share forms/checklists internally (to staff) or externally (via link)
- See their completion history in workspace + full dashboard
- Receive form/checklist submissions routed to them

**Activity visibility:**
- Quick view in workspace sidebar ("My Activity" section)
- Full dashboard page with filtering, search, date ranges
- Completion history on the document itself ("You completed this 3 times")

</vision>

<essential>
## What Must Be Nailed

- **Unified schema for all dynamic content** — One system handles procedures, checklists, and forms. Instance tracking, completion state, routing all work the same way.

- **Fast and frictionless completion** — Complete a checklist in seconds. No unnecessary clicks or confirmations.

- **Clear accountability** — Always know what's expected, who's watching, where results go. Transparent workflow state.

- **Flexible personal workflows** — Staff feel in control. They can create sophisticated workflows in their personal workspace without manager involvement.

</essential>

<specifics>
## Specific Ideas

**Permission model:**
- Wiki templates: Managers/admins configure template settings (notifications, approvals)
- Personal documents: Creator is "manager" — full control over sharing, workflows, routing
- The constraint is wiki vs personal, not role-based for personal content

**Sharing options:**
- Internal: Share with specific staff members (they have accounts)
- External: Generate anonymous link anyone can access (like Google Forms)
- User chooses per share

**Template configuration:**
- Managers/admins set who gets notified on completion
- Optional: require manager sign-off before marked "complete"
- Configurable per procedure/checklist

**Result routing:**
- Templates define fixed destinations
- User-created content: dropdown to select staff member as result recipient
- Email notification option + copy link functionality

</specifics>

<notes>
## Additional Context

**This phase supersedes original Phase 20 scope.** Originally "Semantic Formatting + Progressive Disclosure" — just display formatting. Now expanded to the complete dynamic content infrastructure because:
- Procedures and checklists are fundamentally different from static content
- Display without completion tracking is incomplete
- Forms share the same underlying patterns

**Research findings informed this context:**
- Industry pattern: Template + Instance model (Process Street, SweetProcess)
- Codebase already has `personalDocuments` with `sourceDocumentId` — foundation for instances
- `procedureCompletions` + `activityLog` tables needed
- Step-level tracking for procedures ("3 of 7 steps complete")

**Roadmap impact:**
- Phase 20 becomes larger but more coherent
- Form Builder (Phase 21) focuses on visual builder, not workflow infrastructure
- Phases 21-24 may need adjustment based on what ships in Phase 20

</notes>

<user_journey>
## User Journeys

**Staff completing a wiki procedure:**
```
[View procedure in wiki] --> [Click "Start"] --> [Instance created]
         |                                              |
         v                                              v
   [See steps]                              [Check off steps]
                                                   |
                                                   v
                                          [Mark complete]
                                                   |
                                                   v
                                    [Notification to manager] --> [Manager sign-off]
                                                   |
                                                   v
                                        [Appears in My Activity]
```

**Staff creating shareable checklist:**
```
[Create checklist in workspace] --> [Add items] --> [Configure sharing]
                                                           |
                                      ┌────────────────────┴────────────────────┐
                                      v                                         v
                               [Share internally]                    [Generate public link]
                                      |                                         |
                                      v                                         v
                            [Select staff members]                   [Copy link, share externally]
                                      |                                         |
                                      v                                         v
                             [They receive notification]           [Anyone can complete]
                                                    \                          /
                                                     v                        v
                                               [Results route to creator]
                                                           |
                                                           v
                                                  [Notification received]
```

</user_journey>

---

*Phase: 20-dynamic-content-system*
*Context gathered: 2026-01-17*
