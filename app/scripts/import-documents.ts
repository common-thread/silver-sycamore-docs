import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as fs from "fs";
import * as path from "path";
import { parseAllIndexFiles, type DocMetadata } from "./lib/indexParser";
import { getContentType, REDUNDANT_FORMS, type ContentType } from "./lib/contentTypeMapping";

// Load environment variables
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL environment variable not set");
  console.error("Run: source .env.local && bun run import-docs");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const DOCS_DIR = "../docs";  // docs/ is at repo root, script runs from app/

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

// Default descriptions by subcategory for better fallbacks
const defaultDescriptions: Record<string, string> = {
  "wedding-packages": "Wedding ceremony and reception package details",
  "event-packages": "Event venue rental and catering options",
  "catering": "Menu options and pricing",
  "add-ons": "Additional services and enhancements",
  "booking": "Client intake and booking forms",
  "planning": "Wedding planning checklists and timelines",
  "day-of": "Day-of coordination documents",
  "layouts": "Room layout and seating diagrams",
  "training": "Staff training materials",
  "procedures": "Operational procedures and protocols",
  "hr": "Human resources forms",
  "forms": "Appointment and coordination forms",
  "bar": "Bar inventory and event tracking",
  "facilities": "Facility maintenance and layouts",
};

function extractDescription(content: string, subcategory?: string): string | undefined {
  // Skip frontmatter if present
  let text = content;
  if (text.startsWith("---")) {
    const endFrontmatter = text.indexOf("---", 3);
    if (endFrontmatter > 0) {
      text = text.slice(endFrontmatter + 3).trim();
    }
  }

  // Skip headers and find first usable paragraph
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, headers, horizontal rules
    if (!trimmed || trimmed.startsWith("#") || trimmed === "---") continue;

    // Skip table lines (start with |)
    if (trimmed.startsWith("|")) continue;

    // Skip lines with image references
    if (/IMG_\d+|\.jpg|\.png|\.jpeg/i.test(trimmed)) continue;

    // Skip lines that are just "Source:" metadata
    if (trimmed.toLowerCase().startsWith("source:")) continue;

    // Skip lines that look like raw markdown artifacts
    if (/^\*+[^*]+\*+:?$/.test(trimmed)) continue;

    // Clean up the line
    const clean = trimmed
      .replace(/\*+/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .trim();

    // Need meaningful content (more than just a few words)
    if (clean.length > 15 && !clean.startsWith("-")) {
      return clean.length > 120 ? clean.slice(0, 117) + "..." : clean;
    }
  }

  // Fall back to subcategory-based default
  if (subcategory && defaultDescriptions[subcategory]) {
    return defaultDescriptions[subcategory];
  }

  return undefined;
}

async function importDocuments() {
  const categories = ["services", "clients", "staff", "operations", "deliverables"];
  let imported = 0;
  let skipped = 0;
  let redundantSkipped = 0;
  let usedParsedMetadata = 0;
  let usedHeuristicMetadata = 0;

  // Track content type statistics
  const contentTypeStats: Record<ContentType | "untyped", number> = {
    procedure: 0,
    reference: 0,
    form: 0,
    checklist: 0,
    guide: 0,
    untyped: 0,
  };

  // Parse index.md files for authoritative metadata
  console.log("Parsing index.md files for metadata...");
  const indexMetadata = parseAllIndexFiles(DOCS_DIR);
  console.log(`Found ${indexMetadata.size} document entries in index.md files\n`);

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

  console.log(`\n✅ Import complete: ${imported} documents imported, ${skipped} skipped, ${redundantSkipped} redundant`);
  console.log(`   Metadata source: ${usedParsedMetadata} from index.md, ${usedHeuristicMetadata} from heuristics`);
  console.log(`   Content types: ${contentTypeStats.procedure} procedure, ${contentTypeStats.reference} reference, ${contentTypeStats.form} form, ${contentTypeStats.checklist} checklist, ${contentTypeStats.guide} guide, ${contentTypeStats.untyped} untyped`);

  async function processDirectory(dir: string, category: string, relativePath?: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectory, building relative path from category root
        // e.g., layouts -> layouts/hall -> layouts/hall/...
        const newRelativePath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name;
        await processDirectory(fullPath, category, newRelativePath);
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

        // Prefer markdown over binary: if both file.md and file.docx exist, skip the binary
        // This ensures converted markdown content takes precedence over original binaries
        if (["docx", "xlsx", "pdf"].includes(ext)) {
          const markdownEquivalent = fullPath.replace(/\.(docx|xlsx|pdf)$/i, ".md");
          if (fs.existsSync(markdownEquivalent)) {
            const subPath = relativePath ? `${relativePath}/` : "";
            console.log(`  ⊘ ${category}/${subPath}${entry.name} [BINARY - skipped, .md exists]`);
            skipped++;
            continue;
          }
        }

        // Build lookup key for index.md metadata
        // Key format: category/relativePath/filename-without-ext or category/filename-without-ext
        // relativePath can be nested like "layouts/hall" for proper matching
        const filenameWithoutExt = path.basename(entry.name, path.extname(entry.name));
        const lookupKey = relativePath
          ? `${category}/${relativePath}/${filenameWithoutExt}`
          : `${category}/${filenameWithoutExt}`;

        // Check if this document is redundant (exists in form builder)
        if (REDUNDANT_FORMS.has(lookupKey)) {
          const subPath = relativePath ? `${relativePath}/` : "";
          console.log(`  ⊘ ${category}/${subPath}${entry.name} [REDUNDANT - skipped]`);
          redundantSkipped++;
          continue;
        }

        // Get content type from mapping
        const contentType = getContentType(lookupKey);

        // Try to get metadata from parsed index.md
        const parsedMeta = indexMetadata.get(lookupKey);

        // Extract the immediate parent directory as subcategory for Convex storage
        // e.g., "layouts/hall" -> "hall", "wedding-packages" -> "wedding-packages"
        const subcategory = relativePath ? relativePath.split("/").pop() : undefined;

        let content = "";
        let title: string;
        let description: string | undefined;
        let metadataSource: string;

        if (ext === "md") {
          content = fs.readFileSync(fullPath, "utf-8");
        } else {
          // For binary files, store metadata placeholder
          const stats = fs.statSync(fullPath);
          content = `[Binary file: ${entry.name}]\nSize: ${(stats.size / 1024).toFixed(1)} KB\nType: ${ext.toUpperCase()}`;
        }

        if (parsedMeta) {
          // Use parsed metadata from index.md (authoritative source)
          title = parsedMeta.title;
          description = parsedMeta.description;
          metadataSource = "parsed";
          usedParsedMetadata++;
        } else {
          // Fallback to heuristics for files not in index.md
          title = titleFromFilename(entry.name);

          if (ext === "md") {
            description = extractDescription(content, subcategory);
          } else {
            description = (subcategory && defaultDescriptions[subcategory])
              ? defaultDescriptions[subcategory]
              : `${ext.toUpperCase()} document`;
          }

          metadataSource = "heuristic";
          usedHeuristicMetadata++;
        }

        const slug = slugify(filenameWithoutExt);

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
            contentType,
          });

          imported++;
          // Track content type statistics
          if (contentType) {
            contentTypeStats[contentType]++;
          } else {
            contentTypeStats.untyped++;
          }

          const subPath = relativePath ? `${relativePath}/` : "";
          const sourceTag = metadataSource === "parsed" ? "[index.md]" : "[heuristic]";
          const typeTag = contentType ? `[${contentType}]` : "[untyped]";
          console.log(`  ✓ ${category}/${subPath}${entry.name} ${sourceTag} ${typeTag}`);
        } catch (error: any) {
          console.error(`  ✗ Failed to import ${entry.name}: ${error.message}`);
        }
      }
    }

    // Import index.md as a guide document if it exists at category level
    // Only import at category level (relativePath undefined) to get the 5 navigation guides
    if (!relativePath) {
      const indexPath = path.join(dir, "index.md");
      if (fs.existsSync(indexPath)) {
        const lookupKey = `${category}/index`;
        const contentType = getContentType(lookupKey);

        if (contentType === "guide") {
          const content = fs.readFileSync(indexPath, "utf-8");
          // Extract title from first h1 or use category name
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : capitalize(category);

          try {
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
            contentTypeStats.guide++;
          } catch (error: any) {
            console.error(`  ✗ Failed to import ${category}/index.md: ${error.message}`);
          }
        }
      }
    }
  }
}

importDocuments().catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
