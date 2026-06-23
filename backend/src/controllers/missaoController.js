import pool from "../config/db.js";
import { missaoSchema } from "../schemas/missaoSchema.js";

// Função auxiliar: confirma que o herói existe E é do recrutador logado
async function heroiPertenceAoUsuario(heroiId, usuarioId) {
  const [herois] = await pool.query(
    "SELECT id FROM herois WHERE id = ? AND usuario_id = ?",
    [heroiId, usuarioId]
  );
  return herois.length > 0;
}

// LISTAR as missões de um herói
export async function listarPorHeroi(req, res) {
  try {
    const heroiId = req.params.heroiId;

    const pertence = await heroiPertenceAoUsuario(heroiId, req.usuario.id);
    if (!pertence) {
      return res.status(404).json({ erro: "Herói não encontrado" });
    }

    const [missoes] = await pool.query(
      "SELECT id, descricao, status, recompensa_ouro, criado_em FROM missoes WHERE heroi_id = ? ORDER BY id DESC",
      [heroiId]
    );
    res.json(missoes);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// CRIAR uma missão para um herói ("Enviar para Missão")
export async function criar(req, res) {
  try {
    const heroiId = req.params.heroiId;

    const pertence = await heroiPertenceAoUsuario(heroiId, req.usuario.id);
    if (!pertence) {
      return res.status(404).json({ erro: "Herói não encontrado" });
    }

    const dados = missaoSchema.parse(req.body);

    const [resultado] = await pool.query(
      "INSERT INTO missoes (descricao, status, recompensa_ouro, heroi_id) VALUES (?, ?, ?, ?)",
      [dados.descricao, dados.status || "Em andamento", dados.recompensa_ouro, heroiId]
    );

    res.status(201).json({
      id: resultado.insertId,
      descricao: dados.descricao,
      status: dados.status || "Em andamento",
      recompensa_ouro: dados.recompensa_ouro,
      heroi_id: Number(heroiId),
    });
  } catch (erro) {
    if (erro.name === "ZodError") {
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}