/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activity from "../activity.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as channels from "../channels.js";
import type * as comments from "../comments.js";
import type * as documents from "../documents.js";
import type * as dynamicContent from "../dynamicContent.js";
import type * as folderShares from "../folderShares.js";
import type * as forms from "../forms.js";
import type * as http from "../http.js";
import type * as initiatives from "../initiatives.js";
import type * as lib_roles from "../lib/roles.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as permissions from "../permissions.js";
import type * as personalDocuments from "../personalDocuments.js";
import type * as personalFolders from "../personalFolders.js";
import type * as seed from "../seed.js";
import type * as shareGroups from "../shareGroups.js";
import type * as sharing from "../sharing.js";
import type * as subcategories from "../subcategories.js";
import type * as suggestions from "../suggestions.js";
import type * as testing from "../testing.js";
import type * as users from "../users.js";
import type * as versions from "../versions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  auth: typeof auth;
  categories: typeof categories;
  channels: typeof channels;
  comments: typeof comments;
  documents: typeof documents;
  dynamicContent: typeof dynamicContent;
  folderShares: typeof folderShares;
  forms: typeof forms;
  http: typeof http;
  initiatives: typeof initiatives;
  "lib/roles": typeof lib_roles;
  messages: typeof messages;
  notifications: typeof notifications;
  permissions: typeof permissions;
  personalDocuments: typeof personalDocuments;
  personalFolders: typeof personalFolders;
  seed: typeof seed;
  shareGroups: typeof shareGroups;
  sharing: typeof sharing;
  subcategories: typeof subcategories;
  suggestions: typeof suggestions;
  testing: typeof testing;
  users: typeof users;
  versions: typeof versions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
