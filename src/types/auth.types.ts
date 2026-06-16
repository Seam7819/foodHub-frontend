export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}