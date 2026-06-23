import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { cadastroSchema, loginSchema } from "../schemas/usuarioSchema.js";

export async function cadastrar(req, res) {
  try {
    const dados = cadastroSchema.parse(req.body);

    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [dados.email]
    );
    if (existe.length > 0) {
      return res.status(409).json({ erro: "Este e-mail já está cadastrado" });
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nome_completo, email, senha) VALUES (?, ?, ?)",
      [dados.nome_completo, dados.email, senhaHash]
    );

    res.status(201).json({
      id: resultado.insertId,
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

export async function login(req, res) {
  try {
    const dados = loginSchema.parse(req.body);

    const [usuarios] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [dados.email]
    );
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }
    const usuario = usuarios[0];

    const senhaConfere = await bcrypt.compare(dados.senha, usuario.senha);
    if (!senhaConfere) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome_completo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
      const problemas = erro.issues || erro.errors;
      return res.status(400).json({ erro: problemas[0].message });
    }
    res.status(500).json({ erro: erro.message });
  }
}