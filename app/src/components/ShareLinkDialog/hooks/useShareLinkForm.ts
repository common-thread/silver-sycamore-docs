import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export interface SelectedUser {
  id: Id<"users">;
  email?: string;
  name?: string;
  displayName?: string;
}

export type ShareType = "internal" | "external";
export type ExpirationOption = "never" | "1day" | "7days" | "30days";

export function getExpirationTimestamp(option: ExpirationOption): number | undefined {
  const now = Date.now();
  switch (option) {
    case "1day":
      return now + 24 * 60 * 60 * 1000;
    case "7days":
      return now + 7 * 24 * 60 * 60 * 1000;
    case "30days":
      return now + 30 * 24 * 60 * 60 * 1000;
    default:
      return undefined;
  }
}

export function useShareLinkForm(documentId: Id<"documents">) {
  // Form state
  const [shareType, setShareType] = useState<ShareType>("external");
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [routeToUsers, setRouteToUsers] = useState<SelectedUser[]>([]);
  const [expiration, setExpiration] = useState<ExpirationOption>("never");
  const [maxUses, setMaxUses] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Current user for defaults
  const currentUser = useQuery(api.users.getCurrentUser);
  const createLinkMutation = useMutation(api.sharing.createShareLink);

  // Computed values
  const selectedUserIds = selectedUsers.map((u) => u.id);
  const routeToUserIds = routeToUsers.map((u) => u.id);

  // Handlers for share users (internal)
  const addShareUser = (user: SelectedUser) => {
    if (!selectedUserIds.includes(user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeShareUser = (userId: Id<"users">) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  // Handlers for route users
  const addRouteUser = (user: SelectedUser) => {
    if (!routeToUserIds.includes(user.id)) {
      setRouteToUsers([...routeToUsers, user]);
    }
  };

  const removeRouteUser = (userId: Id<"users">) => {
    setRouteToUsers(routeToUsers.filter((u) => u.id !== userId));
  };

  // Create link
  const createLink = async () => {
    if (shareType === "internal" && selectedUsers.length === 0) {
      return;
    }

    // Default route to self if not specified
    const routeTo =
      routeToUsers.length > 0
        ? routeToUsers.map((u) => u.id)
        : currentUser?.id
        ? [currentUser.id]
        : [];

    if (routeTo.length === 0) {
      return;
    }

    setIsCreating(true);
    try {
      await createLinkMutation({
        documentId,
        shareType,
        sharedWithUserIds:
          shareType === "internal" ? selectedUsers.map((u) => u.id) : undefined,
        routeResultsTo: routeTo,
        expiresAt: getExpirationTimestamp(expiration),
        maxUses: maxUses ? parseInt(maxUses, 10) : undefined,
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Failed to create share link:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedUsers([]);
    setRouteToUsers([]);
    setExpiration("never");
    setMaxUses("");
    setShowAdvanced(false);
  };

  const canCreate =
    !isCreating && (shareType !== "internal" || selectedUsers.length > 0);

  return {
    // State
    shareType,
    setShareType,
    selectedUsers,
    routeToUsers,
    expiration,
    setExpiration,
    maxUses,
    setMaxUses,
    showAdvanced,
    setShowAdvanced,
    isCreating,

    // Computed
    selectedUserIds,
    routeToUserIds,
    canCreate,

    // Handlers
    addShareUser,
    removeShareUser,
    addRouteUser,
    removeRouteUser,
    createLink,
    resetForm,
  };
}
