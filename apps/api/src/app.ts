import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authController } from "./auth.controller";
import { scoreController } from "./score.controller";

export const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/login", authController);
app.use("/score", scoreController);
