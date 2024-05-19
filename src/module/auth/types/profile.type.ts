import { AuthProvider, Gender, Role } from 'src/types/enums';

// Partial ovb
export type GoogleProfile = {
  provider: AuthProvider.GOOGLE;
  email: string;
  username: string;
  profilePicture?: string;
  [x: string]: unknown;
};

// user object in req.user from the access token
export type JWTUser = {
  id: number;
  username: string;
  email: string;
  role: Role;
  designation: string;
  country: string;
  gender: Gender;
  [x: string]: unknown;
};
