import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import { autenticar } from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import heroiRoutes from "./routes/heroiRoutes.js";
import guildaRoutes from "./routes/guildaRoutes.js";
import missaoRoutes from "./routes/missaoRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// rota raiz
app.get("/", (req, res) => {
  res.json({ mensagem: "API do Portal de Heróis no ar" });
});

// rotas da aplicação
app.use("/auth", authRoutes);
app.use("/herois", heroiRoutes);
app.use("/guildas", guildaRoutes);
app.use("/missoes", missaoRoutes);
app.use("/perfil", perfilRoutes);

// sobe o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});