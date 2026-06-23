import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { cadastroSchema, loginSchema } from "../schemas/usuarioSchema.js";

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

  export async function login(req, res) {
  try {
    // 1. Valida os dados
    const dados = loginSchema.parse(req.body);

    // 2. Busca o usuário pelo e-mail
    const [usuarios] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [dados.email]
    );
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }
    const usuario = usuarios[0];

    // 3. Compara a senha digitada com o hash salvo
    const senhaConfere = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaConfere) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    // 4. Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome_completo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Responde com o token e os dados básicos
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
      },
    });
  } catch (erro) {
    if (erro.name === "ZodError") {
      return res.status(400).json({ erro: erro.errors[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}
