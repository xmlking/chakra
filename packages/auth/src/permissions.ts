import { type AccessControl, createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements as adminDefaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";
import {
  defaultStatements as orgDefaultStatements,
  ownerAc as orgOwnerAc,
  adminAc as orgAdminAc,
  memberAc as orgMemberAc,
} from "better-auth/plugins/organization/access";

/**
 * Define custom permissions for the application
 * Using `as const` for proper TypeScript type inference
 *
 * Simplified permissions:
 * - 'read': View access to the resource
 * - 'manage': Full CRUD operations (create, update, delete)
 */
const statement = {
  ...adminDefaultStatements,
  ...orgDefaultStatements,
  // app-specific resources
  account: ["manage"],
  analytics: ["view-basic", "view-advanced", "export"],
  subscription: ["read", "update", "cancel", "manage_billing", "view_usage"],
  tools: ["view", "manage"],
  chats: ["manage"],
  models: ["view", "manage"],
  apiKey: ["create", "read", "update", "delete"],
  featureFlag: ["create", "read", "update", "delete"],
  agents: ["read", "create", "update", "delete"],
} as const;

// Create access control instance
export const ac = createAccessControl(statement) as AccessControl;

/**
 * Type definitions for permission checking
 */
export type PermissionResource = keyof typeof statement;
export type PermissionAction<T extends PermissionResource> = (typeof statement)[T][number];

/**
 * Strongly typed permission check structure
 * Each key must be a valid resource from the statement
 * Each value must be an array of valid actions for that resource
 */
export type PermissionCheck = {
  [K in PermissionResource]?: PermissionAction<K>[];
};

/**
 * Define roles with specific permissions
 * generally admin can do everything owner can do, except deleting org
 */
const user = ac.newRole({
  ...userAc.statements,
});

const superAdmin = ac.newRole({
  ...adminAc.statements,
  organization: ["update", "delete"],
  featureFlag: ["create", "read", "update", "delete"],
});

const owner = ac.newRole({
  ...orgOwnerAc.statements,
  analytics: ["view-basic", "view-advanced", "export"],
  subscription: ["read", "update", "cancel", "manage_billing", "view_usage"],
  tools: ["view", "manage"],
  chats: ["manage"],
  models: ["view", "manage"],
  apiKey: ["create", "read", "update", "delete"],
  featureFlag: ["create", "read", "update", "delete"],
  agents: ["read", "create", "update", "delete"],
});

const admin = ac.newRole({
  ...orgAdminAc.statements,
  analytics: ["view-basic", "view-advanced", "export"],
  subscription: ["read", "update", "cancel", "manage_billing", "view_usage"],
  tools: ["view", "manage"],
  chats: ["manage"],
  models: ["view", "manage"],
  apiKey: ["create", "read", "update", "delete"],
  featureFlag: ["create", "read", "update", "delete"],
  agents: ["read", "create", "update", "delete"],
});

const member = ac.newRole({
  ...orgMemberAc.statements,
  analytics: ["view-basic"],
  subscription: ["read"],
  tools: ["read"],
  chats: ["read"],
  models: ["view"],
  agents: ["read"],
});

const billing = ac.newRole({
  subscription: ["read", "update", "cancel", "manage_billing", "view_usage"],
  tools: ["read"],
  chats: ["read"],
});

export const roles = {
  user,
  superAdmin,
  owner,
  admin,
  member,
  billing,
} as const;
