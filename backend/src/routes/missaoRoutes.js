import { Router } from "express";
import { listarPorHeroi, criar } from "../controllers/missaoController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(autenticar);

router.get("/heroi/:heroiId", listarPorHeroi);
router.post("/heroi/:heroiId", criar);

export default router;