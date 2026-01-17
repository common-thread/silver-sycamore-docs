---
phase: 18-content-audit-type-decisions
plan: FIX
type: fix
wave: 1
depends_on: []
files_modified: [.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md]
autonomous: true
---

<objective>
Re-do content audit by reading ALL actual content: source files in `/docs/` AND converted content from the live GitHub Pages site.

**Problem:** Original 18-01 execution queried Convex and saw `sourceType: "docx"` for 42 documents, classifying them as "binary - cannot analyze" with low confidence. But:
1. 31 markdown files exist in `/docs/` that were never read
2. Binary files (.docx, .xlsx) are converted to HTML by the GitHub Pages build workflow
3. The live site at `https://splurfa.github.io/silver-sycamore-docs/` has ALL content rendered

**Fix:**
1. Read all 31 markdown files from `/docs/`
2. Fetch converted content from GitHub Pages site for binary documents
3. Apply classification heuristics to actual readable content

**Output:** Updated CONTENT-TRACKER.md with accurate, high-confidence classifications based on actual content analysis.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/16-code-mapping-style-audit/DESIRED-STATE.md (Section 4: Content Type System)

# Current flawed tracker
@.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md

# Source content locations
@docs/services/index.md
@docs/clients/index.md
@docs/staff/index.md
@docs/operations/index.md
@docs/deliverables/index.md

# GitHub Pages workflow (shows how binary files are converted)
@.github/workflows/pages.yml

# Live site: https://splurfa.github.io/silver-sycamore-docs/
</context>

<research_findings>
## Content Inventory (from exploration agent)

**Total: 70 files** in `/docs/` directory:

| Source Type | Count | Locations |
|---|---|---|
| Native Markdown (.md) | 31 | All directories |
| DOCX (converted to HTML) | 33 | clients/day-of, clients/layouts, clients/planning, operations |
| XLSX (converted to HTML) | 5 | clients/planning, operations |
| PDF | 1 | operations/forms/tasting-form.pdf |

**Markdown files by directory:**
- `docs/clients/` - 5 files (booking forms, index)
- `docs/deliverables/` - 2 files
- `docs/operations/` - 2 files
- `docs/services/` - 10 files (add-ons, catering, event-packages, wedding-packages)
- `docs/staff/` - 9 files (hr, procedures, training)

**Binary files by directory:**
- `docs/clients/day-of/` - 8 DOCX (timelines, processionals)
- `docs/clients/layouts/` - 15 DOCX (hall, saloon, tea-room, town, open-house)
- `docs/clients/planning/` - 6 DOCX + 2 XLSX (checklists, planning sheets)
- `docs/operations/bar/` - 1 DOCX + 1 XLSX
- `docs/operations/catering/` - 1 XLSX
- `docs/operations/facilities/` - 1 XLSX
- `docs/operations/forms/` - 3 DOCX + 1 PDF
- `docs/services/catering/` - 1 DOCX

**Key insight:** HTML files are NOT stored in repo - they're generated during GitHub Actions build and deployed directly to GitHub Pages. To analyze binary file content, fetch from live site.
</research_findings>

<tasks>

<task type="auto">
  <name>Task 1: Read and classify all source markdown files</name>
  <files>.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md</files>
  <action>
**Read every markdown file in `/docs/` directory and classify based on actual content.**

**1. Get list of all source files:**
```bash
find docs -name "*.md" -type f | sort
```

**2. For EACH markdown file, read it and apply classification heuristics:**

Apply these rules IN ORDER (from DESIRED-STATE.md 4.2):
- `procedure`: Content contains numbered steps (1., 2., 3.) AND imperative verbs (Setup, Check, Verify, Ensure, Clean, etc.)
- `checklist`: Content contains checkboxes (- [ ] or * [ ]) or primarily bullet lists of action items
- `form`: Title contains "Form", "Intake", "Application", or "Request" AND has input fields or data collection structure
- `reference`: Content primarily consists of tables, specifications, pricing, or factual lookup data
- `guide`: Default fallback for explanatory prose content

**3. Document evidence for each classification:**
- Quote specific lines that triggered the classification
- Note confidence level based on how clearly the content matches

**4. Track which binary files need fetching from live site:**
- List all .docx, .xlsx, .pdf files found in docs/
- These will be classified in Task 2 via the live site
  </action>
  <verify>
- All 31 markdown files from /docs/ have been read
- Each has a classification with evidence
- Binary files are listed for Task 2
  </verify>
  <done>
- All markdown files classified with evidence
- Binary file list prepared for live site fetching
  </done>
</task>

<task type="auto">
  <name>Task 2: Fetch and classify binary file content from GitHub Pages</name>
  <files>.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md</files>
  <action>
**Fetch converted content from the live GitHub Pages site for all binary documents.**

The GitHub Pages workflow (`.github/workflows/pages.yml`) converts:
- `.docx` → HTML via LibreOffice
- `.xlsx` → HTML via LibreOffice

The converted content is deployed to: `https://splurfa.github.io/silver-sycamore-docs/`

**1. Get inventory of binary files:**
```bash
find docs -type f \( -name "*.docx" -o -name "*.xlsx" -o -name "*.pdf" \) | sort
```

**2. For each binary file, construct the GitHub Pages URL:**
- `docs/clients/day-of/music-list.docx` → `https://splurfa.github.io/silver-sycamore-docs/clients/day-of/music-list.html`
- The .docx extension becomes .html in the converted output

**3. Use WebFetch to read the converted HTML content:**
For each binary file:
- Fetch the corresponding .html URL from the live site
- Extract the text content from the HTML
- Apply the same classification heuristics as Task 1

**4. Handle PDFs:**
- PDFs may be embedded or linked, not converted to HTML
- Check if a corresponding .html exists, otherwise note as "PDF - not converted"

**5. Classify based on actual rendered content:**
Same heuristics as Task 1:
- `procedure`: Numbered steps + imperative verbs
- `checklist`: Checkboxes or action item lists
- `form`: Data collection fields
- `reference`: Tables, pricing, specifications
- `guide`: Explanatory prose

**6. Document evidence from the fetched content.**
  </action>
  <verify>
- All binary files have been fetched from GitHub Pages (or noted as unavailable)
- Each has a classification with evidence from actual content
- No more "binary - cannot analyze" entries
  </verify>
  <done>
- All convertible binary files classified based on rendered HTML content
- Unconvertible files (if any) clearly documented
  </done>
</task>

<task type="auto">
  <name>Task 3: Compile final CONTENT-TRACKER.md</name>
  <files>.planning/phases/18-content-audit-type-decisions/CONTENT-TRACKER.md</files>
  <action>
**Combine all classifications into the final tracker document.**

**Rewrite CONTENT-TRACKER.md with this structure:**

```markdown
# Content Tracker

**Generated:** [date]
**Phase:** 18-content-audit-type-decisions
**Method:** Direct content analysis (source files + GitHub Pages rendered content)

---

## Summary

- **Total content items analyzed:** [N]
- **Source markdown files:** 31
- **Binary files (converted HTML from GitHub Pages):** [N]
- **Unconvertible files:** [N] (if any)
- **By content type:**
  - procedure: [N] documents
  - reference: [N] documents
  - form: [N] documents
  - checklist: [N] documents
  - guide: [N] documents

---

## Document Classifications

### Procedures

Step-by-step instructions with numbered steps and imperative verbs.

| Document | Source | Confidence | Evidence |
|----------|--------|------------|----------|
| [title] | docs/path/file.md | high | "Contains 23 numbered steps starting with imperative verbs" |
| [title] | GitHub Pages (docs/path/file.docx) | high | "HTML shows numbered workflow steps" |

### References

Factual lookup data: menus, packages, pricing, venue layouts, specifications.

| Document | Source | Confidence | Evidence |
|----------|--------|------------|----------|
| [title] | docs/path/file.md | high | "Contains pricing tables and package options" |

### Forms

Data collection interfaces.

| Document | Source | Confidence | Evidence |
|----------|--------|------------|----------|
| [title] | docs/path/file.md | high | "Contains labeled input fields for client data" |

### Checklists

Items to complete with checkbox or bullet-list format.

| Document | Source | Confidence | Evidence |
|----------|--------|------------|----------|

### Guides

Explanatory prose content, training materials.

| Document | Source | Confidence | Evidence |
|----------|--------|------------|----------|

---

## Form Builder Cross-Reference

Compare documents against formSchemas in Convex to identify redundancy.

| Form Title | Has Document Version | Document Source | Document Type | Resolution |
|------------|---------------------|-----------------|---------------|------------|
| [form] | yes/no | [path] | [type] | keep form / deprecate doc |

---

## Unconvertible Files (if any)

Files that couldn't be analyzed (PDFs not converted, missing from site, etc.)

| Document | Original File | Reason | Recommended Action |
|----------|---------------|--------|-------------------|

---

## Classification Statistics

| Confidence | Count | Percentage |
|------------|-------|------------|
| High | [N] | [%] |
| Medium | [N] | [%] |
| Low | [N] | [%] |

| Source Type | Count |
|-------------|-------|
| Markdown (local) | 31 |
| HTML (GitHub Pages) | [N] |
| Unconvertible | [N] |

---

## Next Phase Readiness

### For Phase 19 (IA Redesign)
Content type assignments enable purpose-based navigation.

### For Phase 20 (Semantic Rendering)
Each content type maps to a specific renderer.
```

**CRITICAL:**
- Every classification must have EVIDENCE from actual content
- High confidence = content clearly matches heuristic
- No guessing based on titles or paths alone
  </action>
  <verify>
- CONTENT-TRACKER.md is complete and well-structured
- All documents (markdown + converted binary) are classified
- Evidence column populated for every entry
- Form builder cross-reference is accurate
- Statistics reflect actual counts
  </verify>
  <done>
- Comprehensive content tracker with evidence-based classifications
- Ready for Phase 19 and Phase 20
  </done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] All 31 markdown files classified with evidence
- [ ] All binary files fetched from GitHub Pages and classified
- [ ] CONTENT-TRACKER.md committed to git
- [ ] No "cannot analyze" entries remain
- [ ] Form builder cross-reference complete
- [ ] Statistics accurate
</verification>

<success_criteria>
- Every document classified based on ACTUAL content (not metadata)
- High-confidence classifications with quoted evidence
- Binary files analyzed via GitHub Pages converted HTML
- Tracker provides accurate foundation for Phase 19 and Phase 20
</success_criteria>

<output>
After completion, create `.planning/phases/18-content-audit-type-decisions/18-FIX-SUMMARY.md`
</output>
