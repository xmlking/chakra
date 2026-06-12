import { authClient } from "./client";

/**
 * Better Auth util function
 */

export async function banUser(userId: string, banReason: string, banExpiresIn?: number) {
  const res = await authClient.admin.banUser({
    userId,
    banReason,
    banExpiresIn,
  });

  if (res?.error) {
    throw new Error(res.error.message || "Failed to ban user");
  }

  return res;
}

export async function unbanUser(userId: string) {
  const res = await authClient.admin.unbanUser({
    userId,
  });

  if (res?.error) {
    throw new Error(res.error.message || "Failed to unban user");
  }

  return res;
}

export async function deleteUser(userId: string) {
  const res = await authClient.admin.removeUser({
    userId,
  });

  if (res?.error) {
    throw new Error(res.error.message || "Failed to delete user");
  }

  return res;
}

export async function revokeUserSessions(userId: string) {
  const res = await authClient.admin.revokeUserSessions({
    userId,
  });

  if (res?.error) {
    throw new Error(res.error.message || "Failed to revoke user sessions");
  }

  return res;
}

export async function impersonateUser(userId: string) {
  const res = await authClient.admin.impersonateUser({
    userId,
  });
  if (res?.error) {
    throw new Error(res.error.message || "Failed to impersonate user");
  }

  return res;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin" | ("user" | "admin")[];
  data?: Record<string, any>;
  autoVerify?: boolean;
}) {
  const { autoVerify, ...userData } = data;

  // If autoVerify is true, add emailVerified to data
  const createData = {
    ...userData,
    data: {
      ...userData.data,
      ...(autoVerify ? { emailVerified: true } : {}),
    },
  };

  const res = await authClient.admin.createUser(createData);

  if (res?.error) {
    throw new Error(res.error.message || "Failed to create user");
  }

  // If not auto-verified, send verification email
  if (!autoVerify) {
    try {
      await authClient.sendVerificationEmail({
        email: data.email,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't throw here as user was created successfully
    }
  }

  return res;
}

export async function updateUserRole(userId: string, role: string) {
  const res = await authClient.admin.setRole({
    userId,
    role: role as "user" | "admin" | ("user" | "admin")[],
  });

  if (res?.error) {
    throw new Error(res.error.message || "Failed to update user role");
  }

  return res;
}
