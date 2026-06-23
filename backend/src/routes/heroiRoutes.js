import { Router } from "express";
import { criar, listar, buscarPorId, atualizar, deletar } from "../controllers/heroiController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas as rotas de herói são protegidas
router.use(autenticar);

router.post("/", criar);
router.get("/", listar);
router.get("/:id", buscarPorId);
router.put("/:id", atualizar);
router.delete("/:id", deletar);

export default router;