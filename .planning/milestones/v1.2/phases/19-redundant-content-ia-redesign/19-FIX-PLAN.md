---
phase: 19-redundant-content-ia-redesign
plan: FIX
type: fix
wave: 1
depends_on: ["19-03"]
files_modified:
  - app/scripts/import-documents.ts
autonomous: true
---

<objective>
Fix guides not being imported by modifying import script to include index.md files as guide documents.

Problem: The content audit identified 5 guides (index.md navigation pages) but the import script skips them because it uses index.md files only for metadata extraction.

Output: Import script imports index.md files as guide documents, Guides nav tab shows content.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md
@app/scripts/import-documents.ts
@app/scripts/lib/contentTypeMapping.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Modify import script to import index.md files as guide documents</name>
  <files>app/scripts/import-documents.ts</files>
  <action>
The import script currently uses index.md files only for metadata extraction and skips importing them as documents. Modify to also import them:

1. After processing regular documents in a category, check if an index.md exists
2. If index.md exists, import it as a document with:
   - title: Category name (e.g., "Clients", "Services", "Staff", "Operations", "Deliverables")
   - slug: "index"
   - category: The category name
   - subcategory: null/undefined
   - contentType: "guide" (from mapping)
   - sourceFile: "index.md"
   - sourceType: "md"

3. Add logic in processCategory() after processing all subcategories:
```typescript
// Import index.md as a guide document if it exists
const indexPath = path.join(categoryPath, "index.md");
if (existsSync(indexPath)) {
  const lookupKey = `${category}/index`;
  const contentType = getContentType(lookupKey);

  if (contentType === "guide") {
    const content = await Bun.file(indexPath).text();
    // Extract title from first h1 or use category name
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : capitalize(category);

    await client.mutation(api.documents.create, {
      title,
      slug: "index",
      category,
      subcategory: undefined,
      content,
      description: `Navigation guide for ${category}`,
      sourceFile: "index.md",
      sourceType: "md",
      contentType,
    });

    console.log(`  ✓ ${category}/index.md [guide]`);
    imported++;
  }
}
```

4. Update final summary to show guide count.
  </action>
  <verify>Run `cd app && npx tsc --noEmit scripts/import-documents.ts` to verify compilation</verify>
  <done>Import script imports index.md files as guide documents</done>
</task>

<task type="auto">
  <name>Task 2: Re-run import and verify guides appear</name>
  <files>None (runtime verification)</files>
  <action>
1. Run the import script:
```bash
cd app && source .env.local && bun run import-docs
```

2. Verify output shows 5 guides imported:
   - clients/index.md [guide]
   - services/index.md [guide]
   - staff/index.md [guide]
   - operations/index.md [guide]
   - deliverables/index.md [guide]

3. Check final summary shows "5 guide" in content type breakdown.
  </action>
  <verify>Import output shows 5 guide documents imported</verify>
  <done>Import script successfully imports 5 guide documents</done>
</task>

<task type="auto">
  <name>Task 3: Verify Guides page shows content</name>
  <files>None (visual verification)</files>
  <action>
1. Take screenshot of http://localhost:3001/guides using Playwright:
```bash
bunx playwright screenshot --browser chromium --wait-for-timeout=3000 http://localhost:3001/guides /tmp/guides-fixed.png
```

2. Verify screenshot shows 5 guide documents listed.
  </action>
  <verify>Guides page shows 5 documents instead of "No guides found"</verify>
  <done>Guides navigation tab displays the 5 index guide documents</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] Import script compiles without errors
- [ ] Running import shows 5 guide documents imported
- [ ] Guides page displays content (not "No guides found")
- [ ] Screenshot saved as evidence
</verification>

<success_criteria>
- Import script imports index.md files as guide documents
- 5 guides appear in the database with contentType="guide"
- Guides nav tab shows the 5 navigation documents
</success_criteria>

<output>
After completion, create `.planning/phases/19-redundant-content-ia-redesign/19-FIX-SUMMARY.md`
</output>
