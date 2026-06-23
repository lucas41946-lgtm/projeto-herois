import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function DetalhesHeroi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estados do formulário de edição
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("Guerreiro");
  const [nivelPoder, setNivelPoder] = useState("");
  const [urlAvatar, setUrlAvatar] = useState("");
  const [guildaId, setGuildaId] = useState("");

  // Estados da nova missão
  const [descricaoMissao, setDescricaoMissao] = useState("");
  const [recompensaMissao, setRecompensaMissao] = useState("");

  // Busca o herói pelo id
  const { data: heroi, isLoading } = useQuery({
    queryKey: ["heroi", id],
    queryFn: async () => {
      const resposta = await api.get(`/herois/${id}`);
      return resposta.data;
    },
  });

  // Busca as guildas pro dropdown
  const { data: guildas } = useQuery({
    queryKey: ["guildas"],
    queryFn: async () => {
      const resposta = await api.get("/guildas");
      return resposta.data;
    },
  });

  // Busca as missões do herói
  const { data: missoes } = useQuery({
    queryKey: ["missoes", id],
    queryFn: async () => {
      const resposta = await api.get(`/missoes/heroi/${id}`);
      return resposta.data;
    },
  });

  // Preenche o formulário quando o herói carrega
  useEffect(() => {
    if (heroi) {
      setNome(heroi.nome);
      setClasse(heroi.classe);
      setNivelPoder(heroi.nivel_poder);
      setUrlAvatar(heroi.url_avatar);
      setGuildaId(heroi.guilda_id);
    }
  }, [heroi]);

  // Mutation: atualizar herói
  const atualizar = useMutation({
    mutationFn: async () => {
      const resposta = await api.put(`/herois/${id}`, {
        nome,
        classe,
        nivel_poder: Number(nivelPoder),
        url_avatar: urlAvatar,
        guilda_id: Number(guildaId),
      });
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroi", id] });
      queryClient.invalidateQueries({ queryKey: ["herois"] });
    },
  });

  // Mutation: criar missão
  const criarMissao = useMutation({
    mutationFn: async () => {
      const resposta = await api.post(`/missoes/heroi/${id}`, {
        descricao: descricaoMissao,
        recompensa_ouro: Number(recompensaMissao),
      });
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missoes", id] });
      setDescricaoMissao("");
      setRecompensaMissao("");
    },
  });

  // Mutation: deletar herói
  const deletar = useMutation({
    mutationFn: async () => {
      await api.delete(`/herois/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["herois"] });
      navigate("/");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Carregando herói...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Detalhes do Herói</h1>
        <Link to="/" className="text-slate-300 hover:text-cyan-400 transition">
          ← Voltar
        </Link>
      </header>

      <main className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
        {/* Edição do herói */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={urlAvatar}
              alt={nome}
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nome}`;
              }}
              className="w-20 h-20 rounded-full object-cover bg-slate-800"
            />
            <h2 className="text-2xl font-bold">{nome}</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400">Nome</label>
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
              <label className="text-sm text-slate-400">Nível de Poder</label>
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
                {guildas?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nome}
                  </option>
                ))}
              </select>
            </div>

            {atualizar.isError && (
              <p className="text-red-400 text-sm">
                {atualizar.error?.response?.data?.erro || "Erro ao salvar"}
              </p>
            )}
            {atualizar.isSuccess && (
              <p className="text-green-400 text-sm">Herói atualizado com sucesso!</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => atualizar.mutate()}
                disabled={atualizar.isPending}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {atualizar.isPending ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button
                onClick={() => {
                  if (confirm("Tem certeza que deseja dispensar este herói?")) {
                    deletar.mutate();
                  }
                }}
                className="bg-slate-800 hover:bg-red-500 py-3 px-6 rounded-lg transition"
              >
                Dispensar Herói
              </button>
            </div>
          </div>
        </div>

        {/* Missões */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">Histórico de Missões</h3>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Descrição da missão"
              value={descricaoMissao}
              onChange={(e) => setDescricaoMissao(e.target.value)}
              className="flex-1 bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="number"
              placeholder="Ouro"
              value={recompensaMissao}
              onChange={(e) => setRecompensaMissao(e.target.value)}
              className="w-full sm:w-32 bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => criarMissao.mutate()}
              disabled={criarMissao.isPending}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              Enviar para Missão
            </button>
          </div>

          {missoes && missoes.length === 0 && (
            <p className="text-slate-400">Nenhuma missão registrada ainda.</p>
          )}

          <div className="flex flex-col gap-3">
            {missoes?.map((m) => (
              <div
                key={m.id}
                className="bg-slate-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{m.descricao}</p>
                  <p className="text-sm text-slate-400">{m.status}</p>
                </div>
                <span className="text-amber-400 font-bold">{m.recompensa_ouro} 🪙</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}