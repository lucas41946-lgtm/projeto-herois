import { z } from "zod";

export const missaoSchema = z.object({
  descricao: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
  status: z.enum(["Em andamento", "Concluída", "Falhou"]).optional(),
  recompensa_ouro: z.coerce.number().int().min(0, "A recompensa não pode ser negativa"),
});