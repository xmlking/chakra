import { defineRelationsPart, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  lastLoginMethod: text("last_login_method"),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  lang: text("lang").default("en"),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
    activeTeamId: text("active_team_id"),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const deviceCode = pgTable("device_code", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  deviceCode: text("device_code").notNull(),
  userCode: text("user_code").notNull(),
  userId: text("user_id"),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status").notNull(),
  lastPolledAt: timestamp("last_polled_at"),
  pollingInterval: integer("polling_interval"),
  clientId: text("client_id"),
  scope: text("scope"),
});

export const jwks = pgTable("jwks", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
  expiresAt: timestamp("expires_at"),
  alg: text("alg"),
  crv: text("crv"),
});

export const oauthClient = pgTable(
  "oauth_client",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    clientId: text("client_id").notNull().unique(),
    clientSecret: text("client_secret"),
    disabled: boolean("disabled").default(false),
    skipConsent: boolean("skip_consent"),
    enableEndSession: boolean("enable_end_session"),
    subjectType: text("subject_type"),
    scopes: text("scopes").array(),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
    name: text("name"),
    uri: text("uri"),
    icon: text("icon"),
    contacts: text("contacts").array(),
    tos: text("tos"),
    policy: text("policy"),
    softwareId: text("software_id"),
    softwareVersion: text("software_version"),
    softwareStatement: text("software_statement"),
    redirectUris: text("redirect_uris").array().notNull(),
    postLogoutRedirectUris: text("post_logout_redirect_uris").array(),
    backchannelLogoutUri: text("backchannel_logout_uri"),
    backchannelLogoutSessionRequired: boolean("backchannel_logout_session_required"),
    tokenEndpointAuthMethod: text("token_endpoint_auth_method"),
    jwks: text("jwks"),
    jwksUri: text("jwks_uri"),
    grantTypes: text("grant_types").array(),
    responseTypes: text("response_types").array(),
    public: boolean("public"),
    type: text("type"),
    requirePKCE: boolean("require_pkce"),
    dpopBoundAccessTokens: boolean("dpop_bound_access_tokens").default(false),
    referenceId: text("reference_id"),
    metadata: jsonb("metadata"),
  },
  (table) => [index("oauthClient_userId_idx").on(table.userId)],
);

export const oauthResource = pgTable("oauth_resource", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  identifier: text("identifier").notNull().unique(),
  name: text("name").notNull(),
  accessTokenTtl: integer("access_token_ttl"),
  refreshTokenTtl: integer("refresh_token_ttl"),
  signingAlgorithm: text("signing_algorithm"),
  signingKeyId: text("signing_key_id"),
  allowedScopes: text("allowed_scopes").array(),
  customClaims: jsonb("custom_claims"),
  dpopBoundAccessTokensRequired: boolean("dpop_bound_access_tokens_required").default(false),
  disabled: boolean("disabled").default(false),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  policyVersion: integer("policy_version").default(1),
  metadata: jsonb("metadata"),
});

export const oauthClientResource = pgTable(
  "oauth_client_resource",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    resourceId: text("resource_id")
      .notNull()
      .references(() => oauthResource.identifier, { onDelete: "cascade" }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("oauthClientResource_clientId_idx").on(table.clientId),
    index("oauthClientResource_resourceId_idx").on(table.resourceId),
  ],
);

export const oauthRefreshToken = pgTable(
  "oauth_refresh_token",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    token: text("token").notNull().unique(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => session.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    authorizationCodeId: text("authorization_code_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at"),
    revoked: timestamp("revoked"),
    rotatedAt: timestamp("rotated_at"),
    rotationReplayResponse: text("rotation_replay_response"),
    rotationReplayExpiresAt: timestamp("rotation_replay_expires_at"),
    authTime: timestamp("auth_time"),
    confirmation: jsonb("confirmation"),
    scopes: text("scopes").array().notNull(),
  },
  (table) => [
    index("oauthRefreshToken_clientId_idx").on(table.clientId),
    index("oauthRefreshToken_sessionId_idx").on(table.sessionId),
    index("oauthRefreshToken_userId_idx").on(table.userId),
    index("oauthRefreshToken_authorizationCodeId_idx").on(table.authorizationCodeId),
  ],
);

export const oauthAccessToken = pgTable(
  "oauth_access_token",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    token: text("token").unique(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => session.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    authorizationCodeId: text("authorization_code_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    refreshId: uuid("refresh_id").references(() => oauthRefreshToken.id, {
      onDelete: "cascade",
    }),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at"),
    revoked: timestamp("revoked"),
    confirmation: jsonb("confirmation"),
    scopes: text("scopes").array().notNull(),
  },
  (table) => [
    index("oauthAccessToken_clientId_idx").on(table.clientId),
    index("oauthAccessToken_sessionId_idx").on(table.sessionId),
    index("oauthAccessToken_userId_idx").on(table.userId),
    index("oauthAccessToken_authorizationCodeId_idx").on(table.authorizationCodeId),
    index("oauthAccessToken_refreshId_idx").on(table.refreshId),
  ],
);

export const oauthConsent = pgTable(
  "oauth_consent",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => oauthClient.clientId, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
    referenceId: text("reference_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    scopes: text("scopes").array().notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [
    index("oauthConsent_clientId_idx").on(table.clientId),
    index("oauthConsent_userId_idx").on(table.userId),
  ],
);

export const oauthClientAssertion = pgTable("oauth_client_assertion", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const organization = pgTable(
  "organization",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
  },
  (table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const organizationRole = pgTable(
  "organization_role",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    permission: text("permission").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    index("organizationRole_organizationId_idx").on(table.organizationId),
    index("organizationRole_role_idx").on(table.role),
  ],
);

export const team = pgTable(
  "team",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    name: text("name").notNull(),
    memberCount: integer("member_count").default(0).notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [index("team_organizationId_idx").on(table.organizationId)],
);

export const teamMember = pgTable(
  "team_member",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    membershipKey: text("membership_key").unique(),
    createdAt: timestamp("created_at"),
  },
  (table) => [
    index("teamMember_teamId_idx").on(table.teamId),
    index("teamMember_userId_idx").on(table.userId),
  ],
);

export const member = pgTable(
  "member",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ],
);

export const invitation = pgTable(
  "invitation",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    teamId: text("team_id"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ],
);

export const apikey = pgTable(
  "apikey",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    configId: text("config_id").default("default").notNull(),
    name: text("name"),
    start: text("start"),
    referenceId: text("reference_id").notNull(),
    prefix: text("prefix"),
    key: text("key").notNull(),
    refillInterval: integer("refill_interval"),
    refillAmount: integer("refill_amount"),
    lastRefillAt: timestamp("last_refill_at"),
    enabled: boolean("enabled").default(true),
    rateLimitEnabled: boolean("rate_limit_enabled").default(true),
    rateLimitTimeWindow: integer("rate_limit_time_window").default(86400000),
    rateLimitMax: integer("rate_limit_max").default(10),
    requestCount: integer("request_count").default(0),
    remaining: integer("remaining"),
    lastRequest: timestamp("last_request"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    permissions: text("permissions"),
    metadata: text("metadata"),
  },
  (table) => [
    index("apikey_configId_idx").on(table.configId),
    index("apikey_referenceId_idx").on(table.referenceId),
    index("apikey_key_idx").on(table.key),
  ],
);

export const passkey = pgTable(
  "passkey",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: timestamp("created_at"),
    aaguid: text("aaguid"),
  },
  (table) => [
    index("passkey_userId_idx").on(table.userId),
    index("passkey_credentialID_idx").on(table.credentialID),
  ],
);

export const authRelations = defineRelationsPart(
  {
    user,
    session,
    account,
    verification,
    deviceCode,
    jwks,
    oauthClient,
    oauthResource,
    oauthClientResource,
    oauthRefreshToken,
    oauthAccessToken,
    oauthConsent,
    oauthClientAssertion,
    organization,
    organizationRole,
    team,
    teamMember,
    member,
    invitation,
    apikey,
    passkey,
  },
  (r) => ({
    user: {
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),
      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),
      oauthClients: r.many.oauthClient({
        from: r.user.id,
        to: r.oauthClient.userId,
      }),
      oauthRefreshTokens: r.many.oauthRefreshToken({
        from: r.user.id,
        to: r.oauthRefreshToken.userId,
      }),
      oauthAccessTokens: r.many.oauthAccessToken({
        from: r.user.id,
        to: r.oauthAccessToken.userId,
      }),
      oauthConsents: r.many.oauthConsent({
        from: r.user.id,
        to: r.oauthConsent.userId,
      }),
      teamMembers: r.many.teamMember({
        from: r.user.id,
        to: r.teamMember.userId,
      }),
      members: r.many.member({
        from: r.user.id,
        to: r.member.userId,
      }),
      invitations: r.many.invitation({
        from: r.user.id,
        to: r.invitation.inviterId,
      }),
      passkeys: r.many.passkey({
        from: r.user.id,
        to: r.passkey.userId,
      }),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
      oauthRefreshTokens: r.many.oauthRefreshToken({
        from: r.session.id,
        to: r.oauthRefreshToken.sessionId,
      }),
      oauthAccessTokens: r.many.oauthAccessToken({
        from: r.session.id,
        to: r.oauthAccessToken.sessionId,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    oauthClient: {
      user: r.one.user({
        from: r.oauthClient.userId,
        to: r.user.id,
      }),
      oauthClientResources: r.many.oauthClientResource({
        from: r.oauthClient.clientId,
        to: r.oauthClientResource.clientId,
      }),
      oauthRefreshTokens: r.many.oauthRefreshToken({
        from: r.oauthClient.clientId,
        to: r.oauthRefreshToken.clientId,
      }),
      oauthAccessTokens: r.many.oauthAccessToken({
        from: r.oauthClient.clientId,
        to: r.oauthAccessToken.clientId,
      }),
      oauthConsents: r.many.oauthConsent({
        from: r.oauthClient.clientId,
        to: r.oauthConsent.clientId,
      }),
    },
    oauthResource: {
      oauthClientResources: r.many.oauthClientResource({
        from: r.oauthResource.identifier,
        to: r.oauthClientResource.resourceId,
      }),
    },
    oauthClientResource: {
      oauthClient: r.one.oauthClient({
        from: r.oauthClientResource.clientId,
        to: r.oauthClient.clientId,
      }),
      oauthResource: r.one.oauthResource({
        from: r.oauthClientResource.resourceId,
        to: r.oauthResource.identifier,
      }),
    },
    oauthRefreshToken: {
      oauthClient: r.one.oauthClient({
        from: r.oauthRefreshToken.clientId,
        to: r.oauthClient.clientId,
      }),
      session: r.one.session({
        from: r.oauthRefreshToken.sessionId,
        to: r.session.id,
      }),
      user: r.one.user({
        from: r.oauthRefreshToken.userId,
        to: r.user.id,
      }),
      oauthAccessTokens: r.many.oauthAccessToken({
        from: r.oauthRefreshToken.id,
        to: r.oauthAccessToken.refreshId,
      }),
    },
    oauthAccessToken: {
      oauthClient: r.one.oauthClient({
        from: r.oauthAccessToken.clientId,
        to: r.oauthClient.clientId,
      }),
      session: r.one.session({
        from: r.oauthAccessToken.sessionId,
        to: r.session.id,
      }),
      user: r.one.user({
        from: r.oauthAccessToken.userId,
        to: r.user.id,
      }),
      oauthRefreshToken: r.one.oauthRefreshToken({
        from: r.oauthAccessToken.refreshId,
        to: r.oauthRefreshToken.id,
      }),
    },
    oauthConsent: {
      oauthClient: r.one.oauthClient({
        from: r.oauthConsent.clientId,
        to: r.oauthClient.clientId,
      }),
      user: r.one.user({
        from: r.oauthConsent.userId,
        to: r.user.id,
      }),
    },
    organization: {
      organizationRoles: r.many.organizationRole({
        from: r.organization.id,
        to: r.organizationRole.organizationId,
      }),
      teams: r.many.team({
        from: r.organization.id,
        to: r.team.organizationId,
      }),
      members: r.many.member({
        from: r.organization.id,
        to: r.member.organizationId,
      }),
      invitations: r.many.invitation({
        from: r.organization.id,
        to: r.invitation.organizationId,
      }),
    },
    organizationRole: {
      organization: r.one.organization({
        from: r.organizationRole.organizationId,
        to: r.organization.id,
      }),
    },
    team: {
      organization: r.one.organization({
        from: r.team.organizationId,
        to: r.organization.id,
      }),
      teamMembers: r.many.teamMember({
        from: r.team.id,
        to: r.teamMember.teamId,
      }),
    },
    teamMember: {
      team: r.one.team({
        from: r.teamMember.teamId,
        to: r.team.id,
      }),
      user: r.one.user({
        from: r.teamMember.userId,
        to: r.user.id,
      }),
    },
    member: {
      organization: r.one.organization({
        from: r.member.organizationId,
        to: r.organization.id,
      }),
      user: r.one.user({
        from: r.member.userId,
        to: r.user.id,
      }),
    },
    invitation: {
      organization: r.one.organization({
        from: r.invitation.organizationId,
        to: r.organization.id,
      }),
      user: r.one.user({
        from: r.invitation.inviterId,
        to: r.user.id,
      }),
    },
    passkey: {
      user: r.one.user({
        from: r.passkey.userId,
        to: r.user.id,
      }),
    },
  }),
);
