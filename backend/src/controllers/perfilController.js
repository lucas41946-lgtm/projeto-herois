import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { atualizarPerfilSchema, trocarSenhaSchema } from "../schemas/usuarioSchema.js";

// Retorna os dados do perfil logado
export async function obter(req, res) {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nome_completo, email FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    if (usuarios.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(usuarios[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
}

// Atualiza nome e e-mail
export async function atualizar(req, res) {
  try {
    const dados = atualizarPerfilSchema.parse(req.body);

    // Verifica se o novo e-mail já é de OUTRO usuário
    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? AND id != ?",
      [dados.email, req.usuario.id]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: "Este e-mail já está em uso" });
    }

    await pool.query(
      "UPDATE usuarios SET nome_completo = ?, email = ? WHERE id = ?",
      [dados.nome_completo, dados.email, req.usuario.id]
    );

    res.json({
      id: req.usuario.id,
      nome_completo: dados.nome_completo,
      email: dados.email,
    });
  } catch (erro) {
    if (erro.name === "ZodError") {
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}

// Troca a senha (exige a senha atual)
export async function trocarSenha(req, res) {
  try {
    const dados = trocarSenhaSchema.parse(req.body);

    // Busca o hash atual do usuário
    const [usuarios] = await pool.query(
      "SELECT senha FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    const usuario = usuarios[0];

    // Confere se a senha atual está correta
    const confere = await bcrypt.compare(dados.senha_atual, usuario.senha);
    if (!confere) {
      return res.status(401).json({ erro: "A senha atual está incorreta" });
    }

    // Gera o hash da nova senha e grava
    const novoHash = await bcrypt.hash(dados.senha_nova, 10);
    await pool.query(
      "UPDATE usuarios SET senha = ? WHERE id = ?",
      [novoHash, req.usuario.id]
    );

    res.json({ mensagem: "Senha alterada com sucesso" });
  } catch (erro) {
    if (erro.name === "ZodError") {
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}