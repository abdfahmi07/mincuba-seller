export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  Profile: Profile;
  Roles: Role[];
}

export interface Profile {
  ID: number;
  FirstName: string;
  LastName: string;
  Bio: unknown;
  Avatar: unknown;
  UserID: string;
  User: unknown;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  level: number;
  created_at: string;
  updated_at: string;
}
