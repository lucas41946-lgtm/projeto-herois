import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Recrutamento() {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("Guerreiro");
  const [nivelPoder, setNivelPoder] = useState("");
  const [urlAvatar, setUrlAvatar] = useState("");
  const [guildaId, setGuildaId] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Busca as guildas pro dropdown
  const { data: guildas } = useQuery({
    queryKey: ["guildas"],
    queryFn: async () => {
      const resposta = await api.get("/guildas");
      return resposta.data;
    },
  });

  // Mutation de criar herói
  const mutation = useMutation({
    mutationFn: async () => {
      const resposta = await api.post("/herois", {
        nome,
        classe,
        nivel_poder: Number(nivelPoder),
        url_avatar: urlAvatar,
        guilda_id: Number(guildaId),
      });
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["herois"] });
      navigate("/");
    },
  });

  function handleSubmit() {
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Recrutar Herói</h1>
        <Link to="/" className="text-slate-300 hover:text-cyan-400 transition">
          ← Voltar
        </Link>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-400">Nome do Herói</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Classe</label>
            <select
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
            >
              <option value="Mago">Mago</option>
              <option value="Guerreiro">Guerreiro</option>
              <option value="Arqueiro">Arqueiro</option>
              <option value="Ladino">Ladino</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Nível de Poder (0 a 100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={nivelPoder}
              onChange={(e) => setNivelPoder(e.target.value)}
              className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">URL do Avatar</label>
            <input
              type="text"
              placeholder="https://..."
              value={urlAvatar}
              onChange={(e) => setUrlAvatar(e.target.value)}
              className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Guilda</label>
            <select
              value={guildaId}
              onChange={(e) => setGuildaId(e.target.value)}
              className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
            >
              <option value="">Selecione uma guilda</option>
              {guildas?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nome}
                </option>
              ))}
            </select>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">
              {mutation.error?.response?.data?.erro || "Erro ao recrutar herói"}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50 mt-2"
          >
            {mutation.isPending ? "Recrutando..." : "Recrutar Herói"}
          </button>
        </div>
      </main>
    </div>
  );
}