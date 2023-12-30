export interface AuthData {
  status: string;
  defaultUser: DefaultUser;
}

export interface DefaultUser {
  id?: string;
  username?: string;
  accessToken?: string;
  role?: string;
}

export interface DefaultError {}
