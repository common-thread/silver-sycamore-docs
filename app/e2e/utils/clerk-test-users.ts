/**
 * Clerk Test User Seeding Utility
 *
 * Uses Clerk Backend SDK to programmatically create and manage test users
 * for E2E testing. Users created via the API have auto-verified emails.
 */

import { createClerkClient } from "@clerk/backend";

// Test user configuration
// Using example.com domain which is reserved for testing (RFC 2606)
// Password is unique and not in breach databases (Clerk rejects common/breached passwords)
export const TEST_USERS = {
  staff: {
    email: "e2e-staff@example.com",
    password: "SilverSycamoreE2E#2025!Staff",
    firstName: "E2E",
    lastName: "Staff",
    role: "staff" as const,
  },
  manager: {
    email: "e2e-manager@example.com",
    password: "SilverSycamoreE2E#2025!Manager",
    firstName: "E2E",
    lastName: "Manager",
    role: "manager" as const,
  },
};

export type TestUserType = keyof typeof TEST_USERS;

// Initialize Clerk client
function getClerkClient() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "CLERK_SECRET_KEY environment variable is required for test user seeding"
    );
  }
  return createClerkClient({ secretKey });
}

/**
 * Find an existing user by email address
 */
export async function findUserByEmail(
  email: string
): Promise<{ id: string } | null> {
  const clerk = getClerkClient();

  try {
    const users = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length > 0) {
      return { id: users.data[0].id };
    }
    return null;
  } catch (error) {
    console.error(`[Clerk] Error finding user ${email}:`, error);
    throw error;
  }
}

/**
 * Create a test user if they don't already exist, or update password if they do
 * Returns the user ID
 */
export async function createTestUser(userType: TestUserType): Promise<string> {
  const user = TEST_USERS[userType];
  const clerk = getClerkClient();

  console.log(`[Clerk] Checking if user exists: ${user.email}`);

  // Check if user already exists
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    console.log(`[Clerk] User already exists: ${user.email} (${existingUser.id})`);
    // Update password to ensure it matches current config
    await updateUserPassword(existingUser.id, user.password);
    return existingUser.id;
  }

  console.log(`[Clerk] Creating new user: ${user.email}`);

  try {
    const newUser = await clerk.users.createUser({
      emailAddress: [user.email],
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      // Skip email verification for test users (API-created users are auto-verified)
      skipPasswordChecks: true,
    });

    console.log(`[Clerk] Created user: ${user.email} (${newUser.id})`);
    return newUser.id;
  } catch (error: unknown) {
    // Handle case where user was created between check and create
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as { errors: { code: string }[] }).errors) &&
      (error as { errors: { code: string }[] }).errors.some(
        (e) => e.code === "form_identifier_exists"
      )
    ) {
      console.log(`[Clerk] User was created concurrently, finding: ${user.email}`);
      const foundUser = await findUserByEmail(user.email);
      if (foundUser) {
        return foundUser.id;
      }
    }
    console.error(`[Clerk] Error creating user ${user.email}:`, error);
    throw error;
  }
}

/**
 * Update a user's password
 */
async function updateUserPassword(userId: string, password: string): Promise<void> {
  const clerk = getClerkClient();

  try {
    await clerk.users.updateUser(userId, {
      password,
      skipPasswordChecks: true,
    });
    console.log(`[Clerk] Updated password for user: ${userId}`);
  } catch (error) {
    console.error(`[Clerk] Error updating password for ${userId}:`, error);
    // Don't throw - password update failure shouldn't block tests if user exists
    console.log(`[Clerk] Continuing despite password update failure`);
  }
}

/**
 * Delete a test user by email
 */
export async function deleteTestUser(userType: TestUserType): Promise<boolean> {
  const user = TEST_USERS[userType];
  const clerk = getClerkClient();

  console.log(`[Clerk] Attempting to delete user: ${user.email}`);

  const existingUser = await findUserByEmail(user.email);
  if (!existingUser) {
    console.log(`[Clerk] User not found, nothing to delete: ${user.email}`);
    return false;
  }

  try {
    await clerk.users.deleteUser(existingUser.id);
    console.log(`[Clerk] Deleted user: ${user.email}`);
    return true;
  } catch (error) {
    console.error(`[Clerk] Error deleting user ${user.email}:`, error);
    throw error;
  }
}

/**
 * Seed all test users (deletes existing users first for clean state)
 */
export async function seedAllTestUsers(): Promise<void> {
  console.log("[Clerk] Seeding all test users (clean slate)...");

  for (const userType of Object.keys(TEST_USERS) as TestUserType[]) {
    // Delete existing user first to clear any device verification state
    await deleteTestUser(userType);
    // Create fresh user
    await createFreshTestUser(userType);
  }

  console.log("[Clerk] All test users seeded successfully");
}

/**
 * Create a fresh test user (assumes user doesn't exist)
 */
async function createFreshTestUser(userType: TestUserType): Promise<string> {
  const user = TEST_USERS[userType];
  const clerk = getClerkClient();

  console.log(`[Clerk] Creating fresh user: ${user.email}`);

  try {
    const newUser = await clerk.users.createUser({
      emailAddress: [user.email],
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      skipPasswordChecks: true,
    });

    console.log(`[Clerk] Created user: ${user.email} (${newUser.id})`);
    return newUser.id;
  } catch (error: unknown) {
    // Handle race condition where user was created between delete and create
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as { errors: { code: string }[] }).errors) &&
      (error as { errors: { code: string }[] }).errors.some(
        (e) => e.code === "form_identifier_exists"
      )
    ) {
      console.log(`[Clerk] User was created concurrently, finding: ${user.email}`);
      const foundUser = await findUserByEmail(user.email);
      if (foundUser) {
        return foundUser.id;
      }
    }
    console.error(`[Clerk] Error creating user ${user.email}:`, error);
    throw error;
  }
}

/**
 * Clean up all test users
 */
export async function cleanupAllTestUsers(): Promise<void> {
  console.log("[Clerk] Cleaning up all test users...");

  for (const userType of Object.keys(TEST_USERS) as TestUserType[]) {
    await deleteTestUser(userType);
  }

  console.log("[Clerk] All test users cleaned up");
}

/**
 * Create a sign-in token for a user that can be used to authenticate
 * via URL. This is useful for hosted Clerk pages where clerk.signIn()
 * doesn't work directly.
 */
export async function createSignInToken(userId: string): Promise<string> {
  const clerk = getClerkClient();

  try {
    const token = await clerk.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 300, // 5 minutes
    });

    console.log(`[Clerk] Created sign-in token for user: ${userId}`);
    return token.token;
  } catch (error) {
    console.error(`[Clerk] Error creating sign-in token for ${userId}:`, error);
    throw error;
  }
}

/**
 * Get the sign-in token URL for a user
 */
export async function getSignInTokenUrl(
  userType: TestUserType,
  redirectUrl: string
): Promise<string> {
  const userId = await createTestUser(userType);
  const token = await createSignInToken(userId);

  // Construct the sign-in token URL
  // Format: https://<your-clerk-frontend-api>/v1/tickets/accept?ticket=<token>&redirect_url=<url>
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required");
  }

  // Extract the frontend API domain from the publishable key
  // pk_test_b3B0aW1hbC1jYXJpYm91LTc0LmNsZXJrLmFjY291bnRzLmRldiQ -> optimal-caribou-74.clerk.accounts.dev
  const base64Part = publishableKey.replace("pk_test_", "").replace("pk_live_", "");
  const frontendApi = Buffer.from(base64Part, "base64").toString("utf-8").replace("$", "");

  const signInUrl = `https://${frontendApi}/v1/tickets/accept?ticket=${token}&redirect_url=${encodeURIComponent(redirectUrl)}`;

  console.log(`[Clerk] Sign-in token URL created for ${TEST_USERS[userType].email}`);
  return signInUrl;
}
