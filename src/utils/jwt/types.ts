/** JWT payload */
export interface Payload {
  /** User id */
  id: string;
  /** User name  of the user */
  username: string;
  /** Available groups for the user */
  groups: string[];
}

/** Tokens to be generated */
export interface Tokens {
  /** Token provided to the client to enable access */
  accessToken: string;
  /** Token sent to client in httpOnly to refresh access */
  refreshToken: string;
  /** Date the refresh token expires */
  refreshExpireDate: Date;
}
