export interface MagicLinkTokenPayload {
  destination: string;
  code: string;
  iat?: number;
  exp?: number;
}
