import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL environment variable not set");
  console.error("Run: source .env.local && bun run import-docs");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const DOCS_DIR = "./docs";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Prefixes to move to the end of the title
const TITLE_PREFIXES = [
  "package-",
  "packages-",
  "booking-form-",
  "contract-",
  "checklist-",
  "timeline-",
  "proposal-",
  "addons-",
];

function titleFromFilename(filename: string): string {
  let name = filename.replace(/\.(md|docx|xlsx|pdf)$/i, "");

  // Check for prefixes to move to end
  for (const prefix of TITLE_PREFIXES) {
    if (name.toLowerCase().startsWith(prefix)) {
      const suffix = prefix.replace(/-$/, "").replace(/-/g, " ");
      name = name.slice(prefix.length) + "-" + suffix;
      break;
    }
  }

  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractDescription(content: string): string | undefined {
  // Skip frontmatter if present
  let text = content;
  if (text.startsWith("---")) {
    const endFrontmatter = text.indexOf("---", 3);
    if (endFrontmatter > 0) {
      text = text.slice(endFrontmatter + 3).trim();
    }
  }

  // Skip headers and find first paragraph
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines, headers, and horizontal rules
    if (!trimmed || trimmed.startsWith("#") || trimmed === "---") continue;
    // Found a paragraph - return first ~100 chars
    const clean = trimmed.replace(/\*+/g, "").replace(/\[.*?\]/g, "").trim();
    if (clean.length > 10) {
      return clean.length > 120 ? clean.slice(0, 117) + "..." : clean;
    }
  }
  return undefined;
}

async function importDocuments() {
  const categories = ["services", "clients", "staff", "operations", "deliverables"];
  let imported = 0;
  let skipped = 0;

  console.log("Clearing existing documents...");
  const deleteResult = await client.mutation(api.documents.deleteAll, {});
  console.log(`Deleted ${deleteResult.deleted} existing documents\n`);

  console.log("Starting document import...\n");

  for (const category of categories) {
    const categoryPath = path.join(DOCS_DIR, category);
    if (!fs.existsSync(categoryPath)) {
      console.log(`Skipping ${category} - directory not found`);
      continue;
    }

    await processDirectory(categoryPath, category, undefined);
  }

  console.log(`\n✅ Import complete: ${imported} documents imported, ${skipped} skipped`);

  async function processDirectory(dir: string, category: string, subcategory?: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectory, using directory name as subcategory
        await processDirectory(fullPath, category, entry.name);
      } else if (entry.isFile()) {
        // Skip index files and hidden files
        if (entry.name.startsWith("index") || entry.name.startsWith(".")) {
          skipped++;
          continue;
        }

        const ext = path.extname(entry.name).slice(1).toLowerCase();

        // Only process supported file types
        if (!["md", "docx", "xlsx", "pdf"].includes(ext)) {
          console.log(`  Skipping unsupported file: ${entry.name}`);
          skipped++;
          continue;
        }

        let content = "";
        let description: string | undefined;

        if (ext === "md") {
          content = fs.readFileSync(fullPath, "utf-8");
          description = extractDescription(content);
        } else {
          // For binary files, store metadata placeholder
          const stats = fs.statSync(fullPath);
          content = `[Binary file: ${entry.name}]\nSize: ${(stats.size / 1024).toFixed(1)} KB\nType: ${ext.toUpperCase()}`;
          description = `${ext.toUpperCase()} document`;
        }

        const slug = slugify(path.basename(entry.name, path.extname(entry.name)));
        const title = titleFromFilename(entry.name);

        try {
          await client.mutation(api.documents.create, {
            title,
            slug,
            category,
            subcategory,
            content,
            description,
            sourceFile: entry.name,
            sourceType: ext,
          });

          imported++;
          const subPath = subcategory ? `${subcategory}/` : "";
          console.log(`  ✓ ${category}/${subPath}${entry.name}`);
        } catch (error: any) {
          console.error(`  ✗ Failed to import ${entry.name}: ${error.message}`);
        }
      }
    }
  }
}

importDocuments().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
