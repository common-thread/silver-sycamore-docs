#!/bin/bash
# Pre-commit hook for Silver Sycamore
# This script runs checks before commits are created

set -e

echo "Running pre-commit checks..."

# Change to app directory for TypeScript/ESLint checks
cd "$(git rev-parse --show-toplevel)/app"

# 1. TypeScript check on changed app files
echo "Checking TypeScript..."
CHANGED_TS=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.tsx?$' | grep '^app/' || true)
if [ -n "$CHANGED_TS" ]; then
    bun run tsc --noEmit 2>&1 || {
        echo "TypeScript errors found. Please fix before committing."
        exit 1
    }
fi

# 2. ESLint check (warning only - doesn't block commit)
echo "Running ESLint (warnings only)..."
bun run lint 2>&1 || echo "Note: ESLint found issues. Consider fixing with 'bun run lint --fix'"

# 3. Sensitive file detection
echo "Checking for sensitive files..."
SENSITIVE_FILES=$(git diff --cached --name-only | grep -E '\.(env|env\.local|credentials|secret)' || true)
if [ -n "$SENSITIVE_FILES" ]; then
    echo "WARNING: Potentially sensitive files detected:"
    echo "$SENSITIVE_FILES"
    echo "Make sure these should be committed."
fi

# 4. Large file warning (>1MB)
echo "Checking for large files..."
LARGE_FILES=$(git diff --cached --name-only -z | xargs -0 -I {} sh -c 'test -f "{}" && du -k "{}" | awk "\$1 > 1024 {print \$2}"' 2>/dev/null || true)
if [ -n "$LARGE_FILES" ]; then
    echo "WARNING: Large files detected (>1MB):"
    echo "$LARGE_FILES"
    echo "Consider if these should be committed."
fi

echo "Pre-commit checks complete."
