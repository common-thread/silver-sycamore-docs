# Phase 11: Forms System - Context

**Gathered:** 2026-01-15
**Status:** Ready for planning

<vision>
## How This Should Work

Staff open the forms section and see their legacy forms already translated into the new form builder — ready to edit. No "here's your old PDFs to look at." Instead: "here's your old forms in the new ecosystem, edit them as you see fit."

When a staff member wants to use a form:
1. They can edit it in the form builder (add fields, change labels, customize)
2. Send it to a client via email (with a link) or copy a shareable link
3. Client fills out the form on the web
4. Response goes to: the backend storage + the staff member who sent it + anyone else they looped in

The form builder is something staff can wrap their brain around. They create forms, send them, and get responses routed to the right people.

</vision>

<essential>
## What Must Be Nailed

- **Staff autonomy** — Staff can create, edit, and send forms themselves without needing the builder to configure anything
- **Response routing** — Form responses reliably go to the right people: the sender + whoever they choose to loop in
- **Editable legacy forms** — Existing forms from the planning docs are already loaded into the builder, ready to tweak and use

All three are equally important for this system to deliver value.

</essential>

<specifics>
## Specific Ideas

- Email with link is the default delivery method
- Shareable link option so staff can copy and share however they want (text, other channels)
- Field types needed: text, numbers, dates, dropdowns, checkboxes, file uploads
- Signatures not required initially — can add later if needed
- Don't worry too much about UI styling — functionality first, style guide coming later for UI refresh
- Jekyll/GitHub Pages legacy system stays intact as the backstop — this is additive, not a replacement

</specifics>

<notes>
## Additional Context

The original vision was a documentation repository — forms, files, SOPs scattered across Google Drive PDFs that were ancient and archaic. The legacy Jekyll site serves that purpose now and remains the backstop.

This form system is the evolution: not just viewing old forms, but translating them into a new ecosystem where staff have control. It's about empowerment — giving staff a tool they can understand and use independently.

The 15 forms from the planning docs (02-form-schemas.md) should be pre-loaded into the builder as starting points.

</notes>

<user_journey>
## User Journey

```
[Staff opens Forms] --> [Sees forms in builder] --> [Edits form if needed]
        |                        |                         |
        v                        v                         v
  [Create new form]       [Send to client]          [Save changes]
                               |
                               v
                    [Choose: Email link OR Copy shareable link]
                               |
                               v
                    [Set response routing: self + others]
                               |
                               v
                    [Client fills out form on web]
                               |
                               v
                    [Response stored + routed to configured recipients]
```

</user_journey>

---

*Phase: 11-forms-system*
*Context gathered: 2026-01-15*
