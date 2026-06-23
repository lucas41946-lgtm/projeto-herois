import { z } from "zod";

export const heroiSchema = z.object({
  nome: z.string().min(3, "O nome do herói deve ter no mínimo 3 caracteres"),
  classe: z.enum(["Mago", "Guerreiro", "Arqueiro", "Ladino"], {
    errorMap: () => ({ message: "Classe inválida" }),
  }),
  nivel_poder: z.coerce
    .number()
    .int("O nível deve ser um número inteiro")
    .min(0, "O nível mínimo é 0")
    .max(100, "O nível máximo é 100"),
  url_avatar: z.string().url("A URL do avatar é inválida"),
  guilda_id: z.coerce.number().int("Guilda inválida"),
});