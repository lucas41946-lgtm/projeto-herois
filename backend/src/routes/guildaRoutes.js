import { Router } from "express";
import { listar } from "../controllers/guildaController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(autenticar);
router.get("/", listar);

export default router;