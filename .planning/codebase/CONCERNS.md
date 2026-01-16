# Codebase Concerns

**Analysis Date:** 2026-01-16

## Tech Debt

**Duplicate getCurrentUser Helper:**
- Issue: `getCurrentUser()` function implemented identically in 5+ files
- Files: `app/convex/forms.ts`, `app/convex/channels.ts`, `app/convex/messages.ts`, `app/convex/notifications.ts`, `app/convex/comments.ts`
- Why: Each module needed auth, copy-pasted instead of extracted
- Impact: Code maintenance burden; auth logic changes must be duplicated
- Fix approach: Extract to shared utility in `app/convex/lib/auth.ts`

**N+1 Query Pattern in Forms:**
- Issue: `getMyReceivedSubmissions()` fetches all submissions then loops to get form data for each
- File: `app/convex/forms.ts` (lines 276-305)
- Why: Quick implementation, acknowledged in code comment
- Impact: Performance degrades linearly with submission count
- Fix approach: Restructure query or use batch loading pattern

**N+1 Query Pattern in Channels:**
- Issue: DMPartner lookup fetches user data in loop for each channel
- File: `app/convex/channels.ts` (lines 75-103)
- Why: Need to enrich channel data with user info
- Impact: Slow channel list loading with many DM channels
- Fix approach: Batch user lookups or denormalize partner info

**Submission Count Efficiency:**
- Issue: `getSubmissionCounts()` collects all submissions just to get count
- File: `app/convex/forms.ts` (lines 308-332)
- Why: No count aggregation available
- Impact: Memory usage scales with submission volume
- Fix approach: Add count index or use aggregation pattern

## Known Bugs

**None currently documented.**

Codebase appears functional based on existing E2E tests. Any runtime bugs should be added here when discovered.

## Security Considerations

**Development Auth Fallback:**
- Risk: Auth handler falls back to first database user if no identity found
- File: `app/convex/forms.ts` (lines 130-140)
- Current mitigation: Only activates in development mode
- Recommendations: Add explicit environment check; fail in production if auth missing

**Missing Form Submission Validation:**
- Risk: Public form endpoint accepts arbitrary JSON string without validation
- File: `app/convex/forms.ts` (lines 481-509, `submitResponse()`)
- Current mitigation: None (data stored as-is)
- Recommendations: Validate submission data against form schema before storing

**Missing .env.example:**
- Risk: New developers don't know required environment variables
- File: `app/.env.example` (missing)
- Current mitigation: Variables documented in CLAUDE.md
- Recommendations: Create `.env.example` with template values

## Performance Bottlenecks

**Forms Module N+1 Queries:**
- Problem: Multiple queries loop through results fetching related data
- File: `app/convex/forms.ts`
- Measurement: Not profiled, but O(n) DB calls per request
- Cause: Per-item lookups in `getMyReceivedSubmissions()`, `getSubmissionCounts()`
- Improvement path: Batch loading, denormalization, or index optimization

**Messages Author Enrichment:**
- Problem: Message list fetches author info for each message individually
- File: `app/convex/messages.ts` (lines 106-111)
- Measurement: Not profiled
- Cause: Author data not denormalized on message
- Improvement path: Store author name/avatar on message or batch lookup

## Fragile Areas

**Large Component Files:**
- Why fragile: Hard to understand, test, and modify
- Files:
  - `app/src/app/style-guide/page.tsx` (857 lines)
  - `app/src/components/SuggestionReview.tsx` (628 lines)
  - `app/src/components/FormBuilder.tsx` (627 lines)
  - `app/src/components/CommentItem.tsx` (597 lines)
  - `app/src/components/FormShareDialog.tsx` (557 lines)
  - `app/src/components/FormRenderer.tsx` (548 lines)
- Common failures: State management bugs, unclear data flow
- Safe modification: Extract sub-components; add unit tests before refactoring
- Test coverage: E2E only; no unit tests for these components

**Weak Type Safety in Convex Helpers:**
- Why fragile: `any` types allow runtime errors that TypeScript should catch
- Files:
  - `app/convex/suggestions.ts` (line 6): `ctx: any`
  - `app/convex/channels.ts` (line 5): `ctx: { auth: any; db: any }`
  - `app/convex/messages.ts` (line 6): `ctx: { auth: any; db: any }`
- Common failures: Refactoring breaks without TypeScript warning
- Safe modification: Replace with proper Convex context types
- Test coverage: Not type-checked by unit tests

## Scaling Limits

**Convex Tier Limits:**
- Current capacity: Depends on Convex plan (free tier has limits)
- Limit: Document count, function invocations, storage
- Symptoms at limit: Rate limiting, function timeouts
- Scaling path: Upgrade Convex plan as usage grows

**No Caching Layer:**
- Current capacity: All queries hit Convex directly
- Limit: Convex function invocation limits
- Symptoms at limit: Slow queries, rate limits
- Scaling path: Add client-side caching or Convex query caching

## Dependencies at Risk

**None critical detected.**

All major dependencies (Next.js, React, Convex, Clerk) are actively maintained.

## Missing Critical Features

**No structured error logging:**
- Problem: Errors logged to console only, no persistence
- Current workaround: Check Vercel logs manually
- Blocks: Debugging production issues, error monitoring
- Implementation complexity: Low (add Sentry or similar)

**No CI/CD pipeline:**
- Problem: No automated testing on push
- Current workaround: Manual test runs
- Blocks: Confidence in deployments, PR validation
- Implementation complexity: Low (add GitHub Actions)

## Test Coverage Gaps

**Form Creation/Submission Flow:**
- What's not tested: Full form builder → publish → submit → view results flow
- Risk: Core feature could break without detection
- Priority: High
- Difficulty to test: Medium (needs form builder interaction)

**Channel/Messaging Workflows:**
- What's not tested: Create channel, send messages, DM flows
- Risk: Communication feature breakage
- Priority: Medium
- Difficulty to test: Medium (real-time aspects)

**Permission Edge Cases:**
- What's not tested: Role-based access denial scenarios
- Risk: Unauthorized access or incorrect denials
- Priority: High
- Difficulty to test: Medium (need role-specific test users)

**Unit Tests (Entire Codebase):**
- What's not tested: Individual functions, components in isolation
- Risk: Bugs in business logic not caught by E2E
- Priority: Medium
- Difficulty to test: Medium (need to add Jest/Vitest)

## Architecture Concerns (from STATE.md)

**Nav/Routing Architecture:**
- Issue: Current navigation structure may not serve content scope well
- File: `.planning/STATE.md` (lines 69-72)
- Status: Deferred to Phase 13.1
- Impact: May require restructuring before styling work

---

*Concerns audit: 2026-01-16*
*Update as issues are fixed or new ones discovered*
