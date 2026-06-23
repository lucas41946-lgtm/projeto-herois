import { Router } from "express";
import { obter, atualizar, trocarSenha } from "../controllers/perfilController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(autenticar);

router.get("/", obter);
router.put("/", atualizar);
router.put("/senha", trocarSenha);

export default router;