import pool from "../config/db.js";
import { heroiSchema } from "../schemas/heroiSchema.js";

// CRIAR herói
export async function criar(req, res) {
  try {
    const dados = heroiSchema.parse(req.body);

    const [resultado] = await pool.query(
      `INSERT INTO herois (nome, classe, nivel_poder, url_avatar, guilda_id, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [dados.nome, dados.classe, dados.nivel_poder, dados.url_avatar, dados.guilda_id, req.usuario.id]
    );

    res.status(201).json({ id: resultado.insertId, ...dados });
  } catch (erro) {
    if (erro.name === "ZodError") {
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}

// LISTAR heróis do recrutador logado (INNER JOIN com guildas)
export async function listar(req, res) {
  try {
    const [herois] = await pool.query(
      `SELECT h.id, h.nome, h.classe, h.nivel_poder, h.url_avatar,
              h.guilda_id, g.nome AS guilda_nome
       FROM herois h
       INNER JOIN guildas g ON h.guilda_id = g.id
       WHERE h.usuario_id = ?
       ORDER BY h.id DESC`,
      [req.usuario.id]
    );
    res.json(herois);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// BUSCAR herói por id
export async function buscarPorId(req, res) {
  try {
    const [herois] = await pool.query(
      `SELECT h.id, h.nome, h.classe, h.nivel_poder, h.url_avatar,
              h.guilda_id, g.nome AS guilda_nome
       FROM herois h
       INNER JOIN guildas g ON h.guilda_id = g.id
       WHERE h.id = ? AND h.usuario_id = ?`,
      [req.params.id, req.usuario.id]
    );

    if (herois.length === 0) {
      return res.status(404).json({ erro: "Herói não encontrado" });
    }
    res.json(herois[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// ATUALIZAR herói
export async function atualizar(req, res) {
  try {
    const dados = heroiSchema.parse(req.body);

    const [resultado] = await pool.query(
      `UPDATE herois
       SET nome = ?, classe = ?, nivel_poder = ?, url_avatar = ?, guilda_id = ?
       WHERE id = ? AND usuario_id = ?`,
      [dados.nome, dados.classe, dados.nivel_poder, dados.url_avatar, dados.guilda_id, req.params.id, req.usuario.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Herói não encontrado" });
    }
    res.json({ id: Number(req.params.id), ...dados });
  } catch (erro) {
    if (erro.name === "ZodError") {
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}

// DELETAR (dispensar) herói
export async function deletar(req, res) {
  try {
    const [resultado] = await pool.query(
      "DELETE FROM herois WHERE id = ? AND usuario_id = ?",
      [req.params.id, req.usuario.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Herói não encontrado" });
    }
    res.json({ mensagem: "Herói dispensado com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}