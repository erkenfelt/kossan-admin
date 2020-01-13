export interface User {
  readonly id: string;
  readonly uid: string;
  readonly accountId: string;
  readonly family?: string;
  readonly name: string;
  readonly email?: string;
  readonly avatarUrl?: string;
  readonly parentalLeave?: boolean;
  readonly admin?: boolean;
}
