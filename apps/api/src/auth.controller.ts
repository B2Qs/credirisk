// POST /login
import { Router, Request, Response } from "express";
import { LoginRequest, LoginResponse } from "@credirisk/shared";
import { validateCredentials, signToken } from "./auth.service";

export const authController = Router();

authController.post(
  "/",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { username, password } = req.body;

    const user = await validateCredentials(username, password);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = signToken(user);
    const response: LoginResponse = { token, role: user.role, rut: user.rut };
    res.json(response);
  },
);
