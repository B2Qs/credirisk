// mock users, verificación password, firma JWT
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload, Role } from "@credirisk/shared";
import { env } from "./config/env";

interface MockUser {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  rut?: string;
}

const HASH = bcrypt.hashSync("password123", 10);

const mockUsers: MockUser[] = [
  { id: "1", username: "admin", passwordHash: HASH, role: "admin" },
  {
    id: "2",
    username: "user",
    passwordHash: HASH,
    role: "user",
    rut: "22.222.222-2",
  },
];

export async function validateCredentials(
  username: string,
  password: string,
): Promise<MockUser | null> {
  const user = mockUsers.find((u) => u.username === username);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export function signToken(user: MockUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    role: user.role,
    ...(user.role === "user" && user.rut ? { rut: user.rut } : {}),
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}
