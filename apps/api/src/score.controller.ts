// GET /score/:rut
import { Router, Response } from "express";
import { ScoreResponse } from "@credirisk/shared";
import {
  authenticate,
  authorizeScoreAccess,
  AuthRequest,
} from "./auth.middleware";
import { computeScore, validarRut, maskRut } from "./score.service";

export const scoreController = Router();

scoreController.get(
  "/:rut",
  authenticate,
  authorizeScoreAccess,
  (req: AuthRequest, res: Response) => {
    const { rut } = req.params;

    if (!validarRut(rut)) {
      return res.status(400).json({ error: "RUT inválido" });
    }

    const response: ScoreResponse = {
      rut, // <- del path, nunca de req.user
      score: computeScore(rut),
      fecha: new Date().toISOString(),
    };

    console.log(
      `[AUDIT] user=${req.user?.sub} role=${req.user?.role} consultó rut=${maskRut(rut)}`,
    );
    res.json(response);
  },
);
