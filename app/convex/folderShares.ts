import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";
import { getCurrentUserId } from "./lib/auth";

// Permission type for folder shares
type Permission = "view" | "comment" | "edit";
const PERMISSION_RANK: Record<Permission, number> = { view: 1, comment: 2, edit: 3 };

// List all shares for a folder (owner only)
export const listByFolder = query({
  args: {
    folderId: v.id("personalFolders"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    // Verify ownership
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.ownerId !== userId) return [];

    const shares = await ctx.db
      .query("folderShares")
      .withIndex("by_folder", (q) => q.eq("folderId", args.folderId))
      .collect();

    // Enrich with user/group info
    const enrichedShares = await Promise.all(
      shares.map(async (share) => {
        let sharedWith = null;

        if (share.sharedWithUserId) {
          const user = await ctx.db.get(share.sharedWithUserId) as Doc<"users"> | null;
          if (user) {
            sharedWith = {
              type: "user" as const,
              id: user._id,
              email: user.email,
              name: user.name,
            };
          }
        } else if (share.sharedWithGroupId) {
          const group = await ctx.db.get(share.sharedWithGroupId) as Doc<"shareGroups"> | null;
          if (group) {
            sharedWith = {
              type: "group" as const,
              id: group._id,
              name: group.name,
            };
          }
        }

        return {
          _id: share._id,
          permission: share.permission,
          createdAt: share.createdAt,
          sharedWith,
        };
      })
    );

    return enrichedShares.filter((s) => s.sharedWith !== null);
  },
});

// List folders shared with current user (via direct share or group membership)
export const listSharedWithMe = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    // 1. Get direct shares where sharedWithUserId = current user
    const directShares = await ctx.db
      .query("folderShares")
      .withIndex("by_user", (q) => q.eq("sharedWithUserId", userId))
      .collect();

    // 2. Get user's group memberships
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // 3. Get group shares for those groups
    const groupIds = memberships.map((m) => m.groupId);
    const groupShares: Doc<"folderShares">[] = [];
    for (const groupId of groupIds) {
      const shares = await ctx.db
        .query("folderShares")
        .withIndex("by_group", (q) => q.eq("sharedWithGroupId", groupId))
        .collect();
      groupShares.push(...shares);
    }

    // 4. Combine and dedupe by folder, keeping highest permission
    const folderMap = new Map<
      string,
      { share: Doc<"folderShares">; permission: string; via: "direct" | "group" }
    >();

    const permissionRank = { view: 1, comment: 2, edit: 3 };

    for (const share of directShares) {
      const existing = folderMap.get(share.folderId);
      if (
        !existing ||
        permissionRank[share.permission as keyof typeof permissionRank] >
          permissionRank[existing.permission as keyof typeof permissionRank]
      ) {
        folderMap.set(share.folderId, {
          share,
          permission: share.permission,
          via: "direct",
        });
      }
    }

    for (const share of groupShares) {
      const existing = folderMap.get(share.folderId);
      if (
        !existing ||
        permissionRank[share.permission as keyof typeof permissionRank] >
          permissionRank[existing.permission as keyof typeof permissionRank]
      ) {
        folderMap.set(share.folderId, {
          share,
          permission: share.permission,
          via: "group",
        });
      }
    }

    // 5. Join folder data
    const results = await Promise.all(
      Array.from(folderMap.entries()).map(
        async ([folderId, { share, permission, via }]) => {
          const folder = await ctx.db.get(folderId as Id<"personalFolders">);
          if (!folder) return null;

          // Get owner info
          const owner = await ctx.db.get(folder.ownerId) as Doc<"users"> | null;

          return {
            _id: folder._id,
            name: folder.name,
            parentId: folder.parentId,
            createdAt: folder.createdAt,
            permission,
            sharedVia: via,
            owner: owner
              ? { id: owner._id, email: owner.email, name: owner.name }
              : null,
          };
        }
      )
    );

    return results.filter(Boolean);
  },
});

// Check user's permission level for a folder
export const getPermission = query({
  args: {
    folderId: v.id("personalFolders"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    // Check if user owns the folder
    const folder = await ctx.db.get(args.folderId);
    if (!folder) return null;
    if (folder.ownerId === userId) return "owner";

    // Check direct share
    const directShare = await ctx.db
      .query("folderShares")
      .withIndex("by_folder_user", (q) =>
        q.eq("folderId", args.folderId).eq("sharedWithUserId", userId)
      )
      .first();

    // Check group shares
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let highestPermission: string | null = directShare?.permission || null;
    const permissionRank = { view: 1, comment: 2, edit: 3 };

    for (const membership of memberships) {
      const groupShare = await ctx.db
        .query("folderShares")
        .withIndex("by_folder_group", (q) =>
          q.eq("folderId", args.folderId).eq("sharedWithGroupId", membership.groupId)
        )
        .first();

      if (groupShare) {
        if (
          !highestPermission ||
          permissionRank[groupShare.permission as keyof typeof permissionRank] >
            permissionRank[highestPermission as keyof typeof permissionRank]
        ) {
          highestPermission = groupShare.permission;
        }
      }
    }

    return highestPermission;
  },
});

// Boolean check if user can access folder at any level
export const canAccess = query({
  args: {
    folderId: v.id("personalFolders"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return false;

    // Check if user owns the folder
    const folder = await ctx.db.get(args.folderId);
    if (!folder) return false;
    if (folder.ownerId === userId) return true;

    // Check direct share
    const directShare = await ctx.db
      .query("folderShares")
      .withIndex("by_folder_user", (q) =>
        q.eq("folderId", args.folderId).eq("sharedWithUserId", userId)
      )
      .first();

    if (directShare) return true;

    // Check group shares
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const membership of memberships) {
      const groupShare = await ctx.db
        .query("folderShares")
        .withIndex("by_folder_group", (q) =>
          q.eq("folderId", args.folderId).eq("sharedWithGroupId", membership.groupId)
        )
        .first();

      if (groupShare) return true;
    }

    return false;
  },
});

// Create share (owner only)
export const share = mutation({
  args: {
    folderId: v.id("personalFolders"),
    userId: v.optional(v.id("users")),
    groupId: v.optional(v.id("shareGroups")),
    permission: v.string(), // "view" | "comment" | "edit"
  },
  handler: async (ctx, args) => {
    const currentUserId = await getCurrentUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    // Validate permission value
    if (!["view", "comment", "edit"].includes(args.permission)) {
      throw new Error("Invalid permission. Must be view, comment, or edit.");
    }

    // Validate: must share with either user OR group, not both or neither
    if ((!args.userId && !args.groupId) || (args.userId && args.groupId)) {
      throw new Error("Must share with either a user or a group, not both");
    }

    // Verify folder ownership
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.ownerId !== currentUserId) {
      throw new Error("Folder not found or access denied");
    }

    // Verify target exists
    if (args.userId) {
      const targetUser = await ctx.db.get(args.userId);
      if (!targetUser) {
        throw new Error("Target user not found");
      }
      // Can't share with yourself
      if (args.userId === currentUserId) {
        throw new Error("Cannot share folder with yourself");
      }
    }

    if (args.groupId) {
      const targetGroup = await ctx.db.get(args.groupId);
      if (!targetGroup) {
        throw new Error("Target group not found");
      }
    }

    // Check for existing share (upsert)
    let existingShare = null;
    if (args.userId) {
      existingShare = await ctx.db
        .query("folderShares")
        .withIndex("by_folder_user", (q) =>
          q.eq("folderId", args.folderId).eq("sharedWithUserId", args.userId)
        )
        .first();
    } else if (args.groupId) {
      existingShare = await ctx.db
        .query("folderShares")
        .withIndex("by_folder_group", (q) =>
          q.eq("folderId", args.folderId).eq("sharedWithGroupId", args.groupId)
        )
        .first();
    }

    if (existingShare) {
      // Update existing share
      await ctx.db.patch(existingShare._id, { permission: args.permission });
      return existingShare._id;
    }

    // Create new share
    return await ctx.db.insert("folderShares", {
      folderId: args.folderId,
      sharedWithUserId: args.userId,
      sharedWithGroupId: args.groupId,
      permission: args.permission,
      sharedBy: currentUserId,
      createdAt: Date.now(),
    });
  },
});

// Update permission level for existing share
export const updatePermission = mutation({
  args: {
    shareId: v.id("folderShares"),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate permission value
    if (!["view", "comment", "edit"].includes(args.permission)) {
      throw new Error("Invalid permission. Must be view, comment, or edit.");
    }

    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    // Verify folder ownership
    const folder = await ctx.db.get(share.folderId);
    if (!folder || folder.ownerId !== userId) {
      throw new Error("Folder not found or access denied");
    }

    await ctx.db.patch(args.shareId, { permission: args.permission });
  },
});

// Remove share access
export const revoke = mutation({
  args: {
    shareId: v.id("folderShares"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    // Verify folder ownership
    const folder = await ctx.db.get(share.folderId);
    if (!folder || folder.ownerId !== userId) {
      throw new Error("Folder not found or access denied");
    }

    await ctx.db.delete(args.shareId);
  },
});
