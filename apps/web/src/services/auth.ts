import { jwtDecode } from "jwt-decode";
import type {
  LoginRequest,
  LoginResponse,
  JwtPayload,
} from "@credirisk/shared";
import { api } from "./api";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", credentials);
  return data;
}

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}
