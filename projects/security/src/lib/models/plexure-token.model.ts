export interface AccountProfile {
  AccountId: string;
  AccountType: number;
  FamilyName: string;
  GivenName: string;
  OAuthSecret: string;
  Role: string;
}

export interface TenantProfile {
  ExpiresAtUtc: number;
  TenantId: string;
  VMobMerchantId: number;
  VMobTenantId: string;
  OrganizationalGroupId: string;
  EnvironmentId: string;
}

export interface PlexureToken {
  sub: string;
  cid: string;
  grant_type: string;
  scope: string;
  account_profile: AccountProfile;
  iat: string;
  sxp: string;
  escrt: string;
  tenant_profile: TenantProfile;
  aud: string[];
  nbf: number;
  exp: number;
  iss: string;
}
