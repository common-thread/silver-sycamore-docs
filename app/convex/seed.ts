import { mutation } from "./_generated/server";

export const seedCategories = mutation({
  handler: async (ctx) => {
    // Check if categories already exist
    const existing = await ctx.db.query("categories").first();
    if (existing) {
      return { message: "Categories already seeded", inserted: 0 };
    }

    const categories = [
      {
        name: "Services",
        slug: "services",
        description: "Packages, pricing, menus",
        order: 1,
      },
      {
        name: "Clients",
        slug: "clients",
        description: "Booking, planning, layouts",
        order: 2,
      },
      {
        name: "Staff",
        slug: "staff",
        description: "Training, procedures, HR",
        order: 3,
      },
      {
        name: "Operations",
        slug: "operations",
        description: "Forms, bar, facilities",
        order: 4,
      },
      {
        name: "Deliverables",
        slug: "deliverables",
        description: "Projects",
        order: 5,
      },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    return { message: "Categories seeded", inserted: categories.length };
  },
});

export const seedInitiatives = mutation({
  handler: async (ctx) => {
    // Clear existing initiatives first
    const existing = await ctx.db.query("initiatives").collect();
    for (const init of existing) {
      await ctx.db.delete(init._id);
    }

    const initiatives = [
      // Active initiatives
      {
        title: "Pine Street Cafe Recipe Book",
        status: "active",
        phase: "Build Finalization",
        nextActions: "Migrate to Next.js, implement image/video upload, build filtering system",
        order: 1,
        updatedAt: Date.now(),
      },
      {
        title: "Wedding Package Contract Generator",
        status: "active",
        phase: "Schema Validation & Testing",
        nextActions: "Validate Convex schema, build PDF UI, integrate e-signature",
        order: 2,
        updatedAt: Date.now(),
      },
      {
        title: "Document Library Dashboard",
        status: "active",
        phase: "Quality Verification",
        nextActions: "Audit element attribution, reformat Markdown files, run E2E tests",
        order: 3,
        updatedAt: Date.now(),
      },
      // Completed deliverables
      {
        title: "Pine Street Cafe Recipe App - Initial Prototype",
        status: "completed",
        completedDate: "Jan 2026",
        notes: "Prototype approved, entering build finalization phase",
        order: 10,
        updatedAt: Date.now(),
      },
      {
        title: "Document Intake & Cataloging",
        status: "completed",
        completedDate: "Jan 2026",
        notes: "87 documents captured from Google Drive and physical binders",
        order: 11,
        updatedAt: Date.now(),
      },
    ];

    for (const init of initiatives) {
      await ctx.db.insert("initiatives", init);
    }

    return { message: "Initiatives seeded", inserted: initiatives.length };
  },
});
