import * as fs from "fs";
import * as path from "path";

/**
 * Metadata extracted from index.md files for deterministic content seeding.
 */
export interface DocMetadata {
  title: string;
  description?: string;
  subcategory: string;
}

/**
 * Parse all index.md files in the docs directory and build a metadata map.
 *
 * @param docsDir Path to the docs/ directory
 * @returns Map keyed by full path like "services/wedding-packages/package-dream"
 */
export function parseAllIndexFiles(docsDir: string): Map<string, DocMetadata> {
  const metadata = new Map<string, DocMetadata>();
  const categories = ["services", "clients", "staff", "operations", "deliverables"];

  for (const category of categories) {
    const indexPath = path.join(docsDir, category, "index.md");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf-8");
      const parsed = parseIndexFile(content, category);
      for (const [key, value] of parsed) {
        metadata.set(key, value);
      }
    }
  }

  return metadata;
}

/**
 * Parse a single index.md file and extract document metadata.
 *
 * Handles two formats:
 * 1. Markdown tables: `| [Title](path) | Description |`
 * 2. Markdown lists: `- [Title](path)` (Room Layouts section)
 */
function parseIndexFile(content: string, category: string): Map<string, DocMetadata> {
  const metadata = new Map<string, DocMetadata>();
  const lines = content.split("\n");

  let currentSubcategory = "";

  for (const line of lines) {
    const trimmed = line.trim();

    // Track subcategory from ## headings
    if (trimmed.startsWith("## ")) {
      currentSubcategory = slugifySubcategory(trimmed.slice(3).trim());
      continue;
    }

    // Track nested subcategory from ### headings (Room Layouts section)
    if (trimmed.startsWith("### ")) {
      // Keep parent subcategory context (layouts) and add nested context
      currentSubcategory = "layouts/" + slugifySubcategory(trimmed.slice(4).trim());
      continue;
    }

    // Parse table rows: | [Title](path) | Description |
    if (trimmed.startsWith("|") && trimmed.includes("[") && trimmed.includes("](")) {
      const parsed = parseTableRow(trimmed, category, currentSubcategory);
      if (parsed) {
        metadata.set(parsed.key, parsed.metadata);
      }
      continue;
    }

    // Parse list items: - [Title](path)
    if (trimmed.startsWith("- [") && trimmed.includes("](")) {
      const parsed = parseListItem(trimmed, category, currentSubcategory);
      if (parsed) {
        metadata.set(parsed.key, parsed.metadata);
      }
      continue;
    }
  }

  return metadata;
}

/**
 * Parse a table row like: | [Title](path) | Description |
 */
function parseTableRow(
  line: string,
  category: string,
  subcategory: string
): { key: string; metadata: DocMetadata } | null {
  // Split by | and filter empty cells
  const cells = line.split("|").map(c => c.trim()).filter(c => c);

  if (cells.length < 1) return null;

  // First cell should contain the link
  const linkCell = cells[0];
  const linkMatch = linkCell.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!linkMatch) return null;

  const title = linkMatch[1];
  const rawPath = linkMatch[2];

  // Skip external URLs
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return null;
  }

  // Extract description from second cell if present
  const description = cells.length >= 2 ? cells[1] : undefined;

  // Normalize path: strip .html extension and resolve
  const normalizedPath = normalizePath(rawPath);

  // Build full key: category/normalizedPath
  const key = `${category}/${normalizedPath}`;

  // Determine subcategory from path or current heading
  const pathParts = normalizedPath.split("/");
  const effectiveSubcategory = pathParts.length > 1 ? pathParts[0] : subcategory;

  return {
    key,
    metadata: {
      title,
      description: description || undefined,
      subcategory: effectiveSubcategory,
    },
  };
}

/**
 * Parse a list item like: - [Title](path)
 */
function parseListItem(
  line: string,
  category: string,
  subcategory: string
): { key: string; metadata: DocMetadata } | null {
  const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!linkMatch) return null;

  const title = linkMatch[1];
  const rawPath = linkMatch[2];

  // Skip external URLs
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return null;
  }

  // Normalize path
  const normalizedPath = normalizePath(rawPath);

  // Build full key
  const key = `${category}/${normalizedPath}`;

  return {
    key,
    metadata: {
      title,
      description: undefined, // List items don't have descriptions
      subcategory,
    },
  };
}

/**
 * Normalize a path by stripping .html extension and trailing slashes.
 */
function normalizePath(rawPath: string): string {
  return rawPath
    .replace(/\.html$/, "")
    .replace(/\/$/, "");
}

/**
 * Convert a heading to a subcategory slug.
 */
function slugifySubcategory(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Simple test when run directly (Bun-specific)
// @ts-ignore - import.meta.main is Bun-specific
if (import.meta.main) {
  const docsDir = "../docs";
  const metadata = parseAllIndexFiles(docsDir);

  console.log(`\nParsed ${metadata.size} documents from index.md files\n`);

  // Check for "Dream Package"
  const dreamKey = "services/wedding-packages/package-dream";
  const dreamMeta = metadata.get(dreamKey);

  if (dreamMeta) {
    console.log("Dream Package test:");
    console.log(`  Key: ${dreamKey}`);
    console.log(`  Title: ${dreamMeta.title}`);
    console.log(`  Description: ${dreamMeta.description}`);
    console.log(`  Subcategory: ${dreamMeta.subcategory}`);

    const expectedTitle = "Dream Package";
    const expectedDesc = "Premium 5-hour ceremony and reception";

    if (dreamMeta.title === expectedTitle && dreamMeta.description === expectedDesc) {
      console.log("\n  PASS: Title and description match expected values");
    } else {
      console.log("\n  FAIL: Mismatch detected");
      console.log(`    Expected title: "${expectedTitle}"`);
      console.log(`    Expected description: "${expectedDesc}"`);
    }
  } else {
    console.log(`FAIL: Dream Package not found at key "${dreamKey}"`);
  }

  console.log("\n--- Sample entries ---");
  let count = 0;
  for (const [key, meta] of metadata) {
    if (count++ >= 10) break;
    console.log(`${key}`);
    console.log(`  Title: ${meta.title}`);
    console.log(`  Description: ${meta.description || "(none)"}`);
    console.log(`  Subcategory: ${meta.subcategory}`);
  }
}
