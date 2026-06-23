import pool from "../config/db.js";

export async function listar(req, res) {
  try {
    const [guildas] = await pool.query("SELECT id, nome FROM guildas ORDER BY nome");
    res.json(guildas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}