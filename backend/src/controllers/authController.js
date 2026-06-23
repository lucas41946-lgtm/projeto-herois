import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { cadastroSchema } from "../schemas/usuarioSchema.js";

export async function cadastrar(req, res) {
  try {
    // 1. Valida os dados de entrada com o Zod
    const dados = cadastroSchema.parse(req.body);

    // 2. Verifica se o e-mail já existe
    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [dados.email]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado" });
    }

    // 3. Gera o hash da senha
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // 4. Salva no banco
    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nome_completo, email, senha) VALUES (?, ?, ?)",
      [dados.nome_completo, dados.email, senhaHash]
    );

    // 5. Responde sem devolver a senha
    res.status(201).json({
      id: resultado.insertId,
      nome_completo: dados.nome_completo,
      email: dados.email,
    });
  } catch (erro) {
    // Erro de validação do Zod
    if (erro.name === "ZodError") {
      return res.status(400).json({ erro: erro.errors[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}