export type Role = "admin" | "user";

export interface JwtPayload {
  sub: string;
  role: Role;
  rut?: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  rut: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
  rut?: string;
}

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}
