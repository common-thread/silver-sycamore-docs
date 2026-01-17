/**
 * Content type mapping utility based on Phase 18 content audit.
 *
 * Maps source file paths to content types and identifies redundant forms
 * that should be excluded from import (they exist in form builder).
 */

export type ContentType = "procedure" | "reference" | "form" | "checklist" | "guide";

/**
 * Maps document lookup keys to their content types.
 * Key format: category/subcategory/filename-without-ext
 *
 * Classifications based on CONTENT-TRACKER.md evidence:
 * - procedure: Step-by-step instructions with numbered steps and imperative verbs
 * - reference: Factual lookup data (menus, packages, pricing, layouts)
 * - form: Data collection interfaces with input fields
 * - checklist: Items to complete with checkbox or bullet-list format
 * - guide: Explanatory prose content, navigation, documentation
 */
export const CONTENT_TYPE_MAP: Record<string, ContentType> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PROCEDURES (10)
  // Step-by-step instructions with numbered steps and imperative verbs
  // ═══════════════════════════════════════════════════════════════════════════

  // Staff procedures
  "staff/procedures/closing-procedures": "procedure",
  "staff/procedures/service-protocols": "procedure",
  "staff/procedures/phone-system-guide": "procedure",

  // Staff training
  "staff/training/training-manual": "procedure",
  "staff/training/training-program": "procedure",
  "staff/training/training-schedule": "procedure",
  "staff/training/sales-script": "procedure",

  // Operations
  "operations/facilities/maintenance-schedule": "procedure",

  // Clients
  "clients/planning/pre-wedding-todo": "procedure",
  "clients/day-of/wedding-processional": "procedure",

  // ═══════════════════════════════════════════════════════════════════════════
  // REFERENCES (32)
  // Factual lookup data: menus, packages, pricing, venue layouts, specifications
  // ═══════════════════════════════════════════════════════════════════════════

  // Services - Catering
  "services/catering/catering-menu": "reference",
  "services/catering/off-premise-menu": "reference",

  // Services - Event packages
  "services/event-packages/packages-reception-hall": "reference",
  "services/event-packages/package-salon-banquet": "reference",
  "services/event-packages/proposal-company-picnic": "reference",
  "services/event-packages/salon-party-packages": "reference",

  // Services - Wedding packages
  "services/wedding-packages/package-dream": "reference",
  "services/wedding-packages/package-simple-elegance": "reference",
  "services/wedding-packages/package-food-truck": "reference",
  "services/wedding-packages/package-reception-only": "reference",
  "services/wedding-packages/package-salon-town-merry": "reference",

  // Services - Add-ons
  "services/add-ons/addons-wedding": "reference",
  "services/add-ons/packages-salon-parties": "reference",

  // Clients - Booking (contract reference, not data collection)
  "clients/booking/contract-package-shower": "reference",

  // Clients - Day-of timelines and reference materials
  "clients/day-of/timeline-evening-6-11pm": "reference",
  "clients/day-of/timeline-first-dance-after-dinner": "reference",
  "clients/day-of/timeline-first-look": "reference",
  "clients/day-of/timeline-micro-wedding": "reference",
  "clients/day-of/shoe-game-questions": "reference",
  "clients/day-of/quinceanera-processional": "reference",

  // Clients - Layouts (all layouts are reference, NOT reset-checklists)
  "clients/layouts/hall/head-table": "reference",
  "clients/layouts/hall/rounds-120": "reference",
  "clients/layouts/saloon/rounds-20": "reference",
  "clients/layouts/town/head-table": "reference",
  "clients/layouts/town/round-tables": "reference",
  "clients/layouts/town/aubrey-75": "reference",
  "clients/layouts/town/aubrey-100": "reference",
  "clients/layouts/tea-room/standard": "reference",
  "clients/layouts/tea-room/valentines-day": "reference",
  "clients/layouts/open-house/general": "reference",
  "clients/layouts/open-house/hall": "reference",
  "clients/layouts/open-house/saloon": "reference",
  "clients/layouts/open-house/town": "reference",

  // Operations - Reference materials
  "operations/facilities/venue-layout": "reference",
  "operations/bar/alcohol-pull-tracker": "reference",
  "operations/catering/catering-sign-up": "reference",

  // ═══════════════════════════════════════════════════════════════════════════
  // FORMS (18)
  // Data collection interfaces with input fields
  // Note: Most forms are REDUNDANT and will be excluded from import
  // ═══════════════════════════════════════════════════════════════════════════

  // Clients - Booking forms (REDUNDANT - form builder has these)
  "clients/booking/booking-form-wedding": "form",
  "clients/booking/booking-form-corporate": "form",
  "clients/booking/booking-form-shower": "form",

  // Staff - HR forms (REDUNDANT - form builder has these)
  "staff/hr/hr-forms": "form",

  // Clients - Day-of forms (REDUNDANT - form builder has this)
  "clients/day-of/music-list": "form",

  // Operations - Forms (REDUNDANT - form builder has these)
  "operations/forms/decor-appointment": "form",
  "operations/forms/final-appointment": "form",
  "operations/forms/vendor-setup": "form",
  "operations/forms/tasting-form": "form",

  // Clients - Planning (REDUNDANT - form builder has these)
  "clients/planning/bridal-planning-2024": "form",
  "clients/planning/micro-wedding-planning": "form",

  // Clients - Reset checklists (REDUNDANT - form builder has these)
  "clients/layouts/hall/reset-checklist": "form",
  "clients/layouts/saloon/reset-checklist": "form",

  // Operations - Bar (NOT redundant - keep this one)
  "operations/bar/bar-event-list": "form",

  // ═══════════════════════════════════════════════════════════════════════════
  // CHECKLISTS (5)
  // Items to complete with checkbox or bullet-list format
  // Note: Planning checklists are GUIDES, not data collection forms
  // ═══════════════════════════════════════════════════════════════════════════

  "clients/planning/checklist-1-3-months": "checklist",
  "clients/planning/checklist-4-6-months": "checklist",
  "clients/planning/checklist-7-8-months": "checklist",
  "clients/planning/checklist-9-12-months": "checklist",
  "deliverables/recipe-app/README": "checklist",

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDES (5)
  // Explanatory prose content, navigation, documentation
  // ═══════════════════════════════════════════════════════════════════════════

  "clients/index": "guide",
  "services/index": "guide",
  "staff/index": "guide",
  "operations/index": "guide",
  "deliverables/index": "guide",
};

/**
 * Set of document paths that are REDUNDANT and should be excluded from import.
 * These documents exist in both markdown/document format AND in the form builder.
 *
 * Resolution: Form builder is authoritative for all data collection interfaces.
 * Total: 17 redundant items (bar-event-list is a form but NOT redundant)
 */
export const REDUNDANT_FORMS: Set<string> = new Set([
  // Booking forms (markdown) - 3 items
  "clients/booking/booking-form-wedding",
  "clients/booking/booking-form-corporate",
  "clients/booking/booking-form-shower",

  // HR forms (markdown) - 1 item (contains 2 forms but single file)
  "staff/hr/hr-forms",

  // Day-of forms (binary) - 1 item
  "clients/day-of/music-list",

  // Operations forms (binary) - 4 items
  "operations/forms/decor-appointment",
  "operations/forms/final-appointment",
  "operations/forms/vendor-setup",
  "operations/forms/tasting-form",

  // Planning forms (binary) - 2 items
  "clients/planning/bridal-planning-2024",
  "clients/planning/micro-wedding-planning",

  // Reset checklists (binary) - 2 items
  "clients/layouts/hall/reset-checklist",
  "clients/layouts/saloon/reset-checklist",

  // Planning checklists - NOT redundant per CONTENT-TRACKER.md
  // These are checklists (guides), not data collection forms
  // "clients/planning/checklist-1-3-months" - KEEP
  // "clients/planning/checklist-4-6-months" - KEEP
  // "clients/planning/checklist-7-8-months" - KEEP
  // "clients/planning/checklist-9-12-months" - KEEP
]);

/**
 * Get the content type for a document by its lookup key.
 *
 * @param lookupKey - The document's lookup key (category/subcategory/filename-without-ext)
 * @returns The content type or undefined if not mapped
 *
 * @example
 * getContentType("staff/procedures/closing-procedures") // "procedure"
 * getContentType("services/catering/catering-menu") // "reference"
 * getContentType("unknown/document") // undefined
 */
export function getContentType(lookupKey: string): ContentType | undefined {
  return CONTENT_TYPE_MAP[lookupKey];
}

/**
 * Check if a document is redundant and should be excluded from import.
 *
 * @param lookupKey - The document's lookup key
 * @returns true if document should be excluded
 */
export function isRedundant(lookupKey: string): boolean {
  return REDUNDANT_FORMS.has(lookupKey);
}

// Statistics for verification
export const CONTENT_TYPE_STATS = {
  procedures: Object.values(CONTENT_TYPE_MAP).filter((t) => t === "procedure").length,
  references: Object.values(CONTENT_TYPE_MAP).filter((t) => t === "reference").length,
  forms: Object.values(CONTENT_TYPE_MAP).filter((t) => t === "form").length,
  checklists: Object.values(CONTENT_TYPE_MAP).filter((t) => t === "checklist").length,
  guides: Object.values(CONTENT_TYPE_MAP).filter((t) => t === "guide").length,
  total: Object.keys(CONTENT_TYPE_MAP).length,
  redundant: REDUNDANT_FORMS.size,
};
