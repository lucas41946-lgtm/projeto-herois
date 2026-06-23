import { z } from "zod";

export const cadastroSchema = z.object({
  nome_completo: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "A senha é obrigatória"),
});

export const atualizarPerfilSchema = z.object({
  nome_completo: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
});

export const trocarSenhaSchema = z.object({
  senha_atual: z.string().min(1, "A senha atual é obrigatória"),
  senha_nova: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
});