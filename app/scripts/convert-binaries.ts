/**
 * Binary-to-Markdown Conversion Script
 *
 * Converts DOCX, XLSX, and PDF files to markdown by fetching
 * the rendered HTML from GitHub Pages and converting to markdown.
 *
 * Usage:
 *   bun run scripts/convert-binaries.ts         # Full conversion
 *   bun run scripts/convert-binaries.ts --dry-run  # List files only
 */

import * as fs from "fs";
import * as path from "path";
import TurndownService from "turndown";

const DOCS_DIR = path.resolve(__dirname, "../../docs");
const GITHUB_PAGES_BASE = "https://splurfa.github.io/silver-sycamore-docs";
const DRY_RUN = process.argv.includes("--dry-run");

// Initialize Turndown for HTML-to-Markdown conversion
const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// Custom rule to handle tables better
turndown.addRule("table", {
  filter: "table",
  replacement: function (content, node) {
    const table = node as HTMLTableElement;
    const rows: string[][] = [];

    // Process all rows
    for (const row of Array.from(table.querySelectorAll("tr"))) {
      const cells: string[] = [];
      for (const cell of Array.from(row.querySelectorAll("th, td"))) {
        cells.push((cell.textContent || "").trim().replace(/\n/g, " "));
      }
      if (cells.length > 0 && cells.some(c => c)) {
        rows.push(cells);
      }
    }

    if (rows.length === 0) return "";

    // Determine max columns
    const maxCols = Math.max(...rows.map(r => r.length));

    // Normalize rows to have same number of columns
    const normalizedRows = rows.map(row => {
      while (row.length < maxCols) row.push("");
      return row;
    });

    // Build markdown table
    let markdown = "\n\n";
    markdown += "| " + normalizedRows[0].join(" | ") + " |\n";
    markdown += "| " + normalizedRows[0].map(() => "---").join(" | ") + " |\n";

    for (let i = 1; i < normalizedRows.length; i++) {
      markdown += "| " + normalizedRows[i].join(" | ") + " |\n";
    }

    return markdown + "\n";
  }
});

// Remove navigation elements
turndown.addRule("removeNav", {
  filter: ["nav", "header", "footer"],
  replacement: () => ""
});

interface BinaryFile {
  absolutePath: string;
  relativePath: string; // path relative to docs/
  extension: string;
  githubPagesUrl: string;
  markdownPath: string;
}

/**
 * Find all binary files in docs directory
 */
function findBinaryFiles(): BinaryFile[] {
  const binaries: BinaryFile[] = [];
  const extensions = [".docx", ".xlsx", ".pdf"];

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          const relativePath = path.relative(DOCS_DIR, fullPath);
          const pathWithoutExt = relativePath.replace(/\.(docx|xlsx|pdf)$/i, "");

          binaries.push({
            absolutePath: fullPath,
            relativePath,
            extension: ext,
            githubPagesUrl: `${GITHUB_PAGES_BASE}/${pathWithoutExt}.html`,
            markdownPath: fullPath.replace(/\.(docx|xlsx|pdf)$/i, ".md"),
          });
        }
      }
    }
  }

  scanDir(DOCS_DIR);
  return binaries;
}

/**
 * Fetch HTML content from GitHub Pages
 */
async function fetchGitHubPagesContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`  Failed to fetch ${url}:`, error);
    return null;
  }
}

/**
 * Extract main content from GitHub Pages HTML
 */
function extractMainContent(html: string): string {
  // Remove script and style tags
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Try to find main content container
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = mainMatch[1];
  } else {
    // Try article
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      content = articleMatch[1];
    } else {
      // Try content div
      const contentDivMatch = content.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (contentDivMatch) {
        content = contentDivMatch[1];
      } else {
        // Fall back to body
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          content = bodyMatch[1];
        }
      }
    }
  }

  // Remove common non-content elements
  content = content
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");

  return content;
}

/**
 * Convert HTML to clean Markdown
 */
function htmlToMarkdown(html: string): string {
  const mainContent = extractMainContent(html);
  let markdown = turndown.turndown(mainContent);

  // Clean up the markdown
  markdown = markdown
    // Remove excessive blank lines
    .replace(/\n{3,}/g, "\n\n")
    // Clean up list spacing
    .replace(/^\s*-\s+/gm, "- ")
    // Remove empty links
    .replace(/\[([^\]]*)\]\(\)/g, "$1")
    // Clean up heading spacing
    .replace(/^(#+)\s*/gm, "$1 ")
    // Trim leading/trailing whitespace
    .trim();

  return markdown;
}

/**
 * Extract title from markdown or generate from filename
 */
function extractOrGenerateTitle(markdown: string, filename: string): string {
  // Try to find h1 in markdown
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Generate from filename
  const name = path.basename(filename, path.extname(filename));
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Create placeholder markdown for files that can't be converted
 */
function createPlaceholder(file: BinaryFile, reason: string): string {
  const title = extractOrGenerateTitle("", file.absolutePath);
  const extension = file.extension.slice(1).toUpperCase();

  return `# ${title}

> **Note:** Content pending conversion from ${extension} format.
>
> ${reason}

---

*Original file: ${path.basename(file.absolutePath)}*
`;
}

/**
 * Main conversion process
 */
async function convertBinaries() {
  console.log("Binary-to-Markdown Conversion Script");
  console.log("====================================\n");

  const files = findBinaryFiles();
  console.log(`Found ${files.length} binary files to process\n`);

  if (DRY_RUN) {
    console.log("DRY RUN - listing files only:\n");
    for (const file of files) {
      console.log(`  ${file.relativePath}`);
      console.log(`    -> ${file.githubPagesUrl}`);
      console.log(`    -> ${path.basename(file.markdownPath)}`);
    }
    console.log(`\nTotal: ${files.length} files`);
    return;
  }

  const stats = {
    converted: 0,
    skipped: 0,
    failed: 0,
    placeholder: 0,
  };

  for (const file of files) {
    console.log(`Processing: ${file.relativePath}`);

    // Skip if markdown already exists
    if (fs.existsSync(file.markdownPath)) {
      console.log(`  Skipped: markdown already exists`);
      stats.skipped++;
      continue;
    }

    // Special handling for PDF (tasting-form.pdf) - per CONTENT-TRACKER.md
    if (file.extension === ".pdf") {
      const markdown = createPlaceholder(file, "PDF files cannot be automatically converted. This form is available in the Form Builder.");
      fs.writeFileSync(file.markdownPath, markdown);
      console.log(`  Created placeholder (PDF)`);
      stats.placeholder++;
      continue;
    }

    // Fetch from GitHub Pages
    const html = await fetchGitHubPagesContent(file.githubPagesUrl);

    if (!html) {
      // Create placeholder for 404s
      const markdown = createPlaceholder(file, "Content not available on GitHub Pages.");
      fs.writeFileSync(file.markdownPath, markdown);
      console.log(`  Created placeholder (404)`);
      stats.placeholder++;
      continue;
    }

    // Convert to markdown
    try {
      let markdown = htmlToMarkdown(html);

      // If markdown is too short, it might not have converted properly
      if (markdown.length < 50) {
        const placeholder = createPlaceholder(file, "Content could not be extracted properly.");
        fs.writeFileSync(file.markdownPath, placeholder);
        console.log(`  Created placeholder (content too short)`);
        stats.placeholder++;
        continue;
      }

      // Add title if not present
      if (!markdown.startsWith("#")) {
        const title = extractOrGenerateTitle(markdown, file.absolutePath);
        markdown = `# ${title}\n\n${markdown}`;
      }

      // Write markdown file
      fs.writeFileSync(file.markdownPath, markdown);
      console.log(`  Converted successfully (${markdown.length} chars)`);
      stats.converted++;

    } catch (error) {
      console.error(`  Error converting: ${error}`);
      const markdown = createPlaceholder(file, `Conversion error: ${error}`);
      fs.writeFileSync(file.markdownPath, markdown);
      stats.failed++;
    }

    // Small delay to be nice to GitHub Pages
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log("\n====================================");
  console.log("Conversion Summary");
  console.log("====================================");
  console.log(`  Converted:   ${stats.converted}`);
  console.log(`  Skipped:     ${stats.skipped} (markdown already existed)`);
  console.log(`  Placeholder: ${stats.placeholder} (PDF/404/extraction issue)`);
  console.log(`  Failed:      ${stats.failed}`);
  console.log(`  Total:       ${files.length}`);
}

// Run
convertBinaries().catch(error => {
  console.error("Conversion failed:", error);
  process.exit(1);
});
