---
phase: 20-dynamic-content-system
plan: FIX
type: fix
wave: 1
depends_on: ["20-05"]
files_modified:
  - app/scripts/convert-binaries.ts
  - docs/**/*.md (39 new files replacing binaries)
autonomous: true
---

<objective>
Convert all 39 binary files (DOCX, XLSX, PDF) to markdown so content renders properly in the app.

**Problem:** Binary files have placeholder content like `[Binary file: xxx.docx]` causing procedures to show "0 steps" and references to display no content.

**User directive:** "All documents must be converted to Markdown before we figure out how to render them and categorize them in the app. No half measures."

**Source:** GitHub Pages at splurfa.github.io/silver-sycamore-docs renders these binaries as HTML. We'll fetch that HTML and convert to markdown.

Output: 39 new .md files replacing binary placeholders, re-imported to database.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
@.planning/phases/20-dynamic-content-system/.continue-here.md

**Content audit reference:**
@.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md

**Import script:**
@app/scripts/import-documents.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create binary-to-markdown conversion script</name>
  <files>app/scripts/convert-binaries.ts</files>
  <action>
Create a script that:
1. Finds all binary files (DOCX, XLSX, PDF) in /docs recursively
2. For each binary file:
   - Constructs GitHub Pages URL: `https://splurfa.github.io/silver-sycamore-docs/{path-without-extension}.html`
   - Fetches the HTML content
   - Extracts the main content (skip navigation, headers, footers)
   - Converts HTML to markdown using turndown or similar
   - Saves as .md file with same name (e.g., pre-wedding-todo.docx → pre-wedding-todo.md)
   - Optionally removes or renames the original binary
3. Logs progress and any failures

Use bun runtime. Handle 404s gracefully (some files may not have HTML equivalents).

For XLSX files: GitHub Pages may not render these. Extract what's possible or mark for manual review.

For the 1 PDF (tasting-form.pdf): This is a form builder duplicate per CONTENT-TRACKER.md - can skip or create minimal placeholder.
  </action>
  <verify>Script runs without error: `cd app && bun run scripts/convert-binaries.ts --dry-run`</verify>
  <done>Script exists and can identify all 39 binary files</done>
</task>

<task type="auto">
  <name>Task 2: Execute conversion for all binary files</name>
  <files>docs/**/*.md</files>
  <action>
Run the conversion script in full mode:
1. `cd app && bun run scripts/convert-binaries.ts`
2. Monitor output for failures
3. For any files that fail to convert (404, parsing error), create minimal markdown with:
   - Title from filename
   - Note: "Content pending conversion from [original format]"
   - Link to original file if still exists

Expected outcome: 39 new .md files created alongside or replacing binaries.

Do NOT delete original binaries yet - keep them for reference until verified.
  </action>
  <verify>
Count new .md files created:
```bash
find docs -name "*.md" -newer app/scripts/convert-binaries.ts | wc -l
```
Should be close to 39 (some may have existed as guides).
  </verify>
  <done>All binary files have corresponding .md files with actual content</done>
</task>

<task type="auto">
  <name>Task 3: Update import script to prefer markdown over binary</name>
  <files>app/scripts/import-documents.ts</files>
  <action>
Modify import-documents.ts:
1. When processing a directory, if both `file.md` and `file.docx` exist, use the .md version
2. Skip binary files that have a corresponding .md file
3. Keep existing binary placeholder logic as fallback for any remaining binaries

This ensures the new markdown content gets imported without breaking the script for edge cases.
  </action>
  <verify>`grep -n "\.md.*\.docx\|prefer.*markdown" app/scripts/import-documents.ts` shows the new logic</verify>
  <done>Import script prefers .md files over binaries when both exist</done>
</task>

<task type="auto">
  <name>Task 4: Re-import documents to database</name>
  <files>None (database operation)</files>
  <action>
1. Clear existing documents: The import script should handle this (check if it does upsert or requires clearing)
2. Run import: `cd app && source .env.local && bun run scripts/import-documents.ts`
3. Verify document count matches expected

If import script doesn't clear old data, may need to:
- Add a --clear flag to the script, OR
- Run a Convex mutation to clear documents table first
  </action>
  <verify>
Check Convex dashboard or run query to verify:
- Document count is correct
- Sample procedure documents have actual content (not placeholder)
- "Pre-Wedding To Do List" shows actual steps, not "0 steps"
  </verify>
  <done>Database contains documents with real markdown content</done>
</task>

<task type="auto">
  <name>Task 5: Verify procedure/checklist rendering</name>
  <files>None (verification)</files>
  <action>
Start the dev server and verify the two problem documents:
1. `cd app && bun run dev`
2. Navigate to "Pre-Wedding To Do List" procedure
3. Verify it shows actual steps (h2 headers parsed as steps)
4. Navigate to "Wedding Processional" procedure
5. Verify it shows actual content

If steps still show "0 steps":
- Check the markdown content for h2 headers
- May need to adjust content structure or step parser
  </action>
  <verify>
Browser shows:
- Pre-Wedding To Do List: Multiple steps visible, "Start Procedure" button works
- Wedding Processional: Content renders, appropriate for content type
  </verify>
  <done>Dynamic content system works with real content</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] All 39 binary files have markdown equivalents
- [ ] Import script runs successfully with new content
- [ ] Database contains real markdown content (not placeholders)
- [ ] Procedure documents show actual steps
- [ ] No regressions in existing functionality
</verification>

<success_criteria>
- All binary content converted to markdown
- Import process uses new markdown files
- Dynamic content system renders real content
- Phase 20 can be marked truly complete
</success_criteria>

<output>
After completion, create `.planning/phases/20-dynamic-content-system/20-FIX-SUMMARY.md`
</output>
