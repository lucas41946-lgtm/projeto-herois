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

// rotas de teste (remover antes do deploy)
app.get("/db-teste", async (req, res) => {
  try {
    const [linhas] = await pool.query("SELECT * FROM guildas");
    res.json(linhas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.get("/protegido", autenticar, (req, res) => {
  res.json({ mensagem: "Você acessou uma rota protegida!", usuario: req.usuario });
});

// sobe o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});