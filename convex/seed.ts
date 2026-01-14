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
    // Check if initiatives already exist
    const existing = await ctx.db.query("initiatives").first();
    if (existing) {
      return { message: "Initiatives already seeded", inserted: 0 };
    }

    const initiatives = [
      {
        title: "Silver Sycamore Hub",
        status: "active",
        phase: "Development",
        nextActions: "Complete frontend, deploy to Vercel",
        order: 1,
        updatedAt: Date.now(),
      },
      {
        title: "Recipe App",
        status: "active",
        phase: "Planning",
        nextActions: "Finalize requirements with client",
        order: 2,
        updatedAt: Date.now(),
      },
    ];

    for (const init of initiatives) {
      await ctx.db.insert("initiatives", init);
    }

    return { message: "Initiatives seeded", inserted: initiatives.length };
  },
});
