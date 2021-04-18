/** JWT payload */
export interface Payload {
  /** User id */
  id: string;
  /** User name  of the user */
  username: string;
  /** Available groups for the user */
  groups: string[];
}
