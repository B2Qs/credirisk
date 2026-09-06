// authenticate + authorizeScoreAccess (RBAC)
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@credirisk/shared";
import { env } from "./config/env";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const normalize = (rut: string) => rut.replace(/[.\-\s]/g, "").toUpperCase();

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no provisto" });
  }

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, env.jwtSecret) as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function authorizeScoreAccess(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const { rut } = req.params;
  const user = req.user!;

  if (user.role === "admin") return next();
  if (
    user.role === "user" &&
    user.rut &&
    normalize(user.rut) === normalize(rut)
  )
    return next();

  return res
    .status(403)
    .json({ error: "No autorizado para consultar este RUT" });
}
