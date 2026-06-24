import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CardHeroi from "../components/CardHeroi.jsx";

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroClasse, setFiltroClasse] = useState("Todos");

  const { data: herois, isLoading, isError } = useQuery({
    queryKey: ["herois"],
    queryFn: async () => {
      const resposta = await api.get("/herois");
      return resposta.data;
    },
  });

  const metricas = useMemo(() => {
    if (!herois || herois.length === 0) {
      return { total: 0, mediaPoder: 0, guildaMaisForte: "—" };
    }
    const total = herois.length;
    const somaPoder = herois.reduce((soma, h) => soma + h.nivel_poder, 0);
    const mediaPoder = Math.round(somaPoder / total);

    const poderPorGuilda = {};
    for (const h of herois) {
      poderPorGuilda[h.guilda_nome] =
        (poderPorGuilda[h.guilda_nome] || 0) + h.nivel_poder;
    }
    const guildaMaisForte = Object.keys(poderPorGuilda).reduce((a, b) =>
      poderPorGuilda[a] > poderPorGuilda[b] ? a : b
    );

    return { total, mediaPoder, guildaMaisForte };
  }, [herois]);

  const heroisFiltrados = useMemo(() => {
    if (!herois) return [];
    return herois.filter((h) => {
      const baterNome = h.nome.toLowerCase().includes(busca.toLowerCase());
      const baterClasse = filtroClasse === "Todos" || h.classe === filtroClasse;
      return baterNome && baterClasse;
    });
  }, [herois, busca, filtroClasse]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const classes = ["Todos", "Mago", "Guerreiro", "Arqueiro", "Ladino"];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Bem-vindo, Recrutador{" "}
          <span className="text-cyan-400">{usuario?.nome_completo}</span>
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="text-slate-300 hover:text-cyan-400 transition">
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-red-500 px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Seus Heróis</h2>
          <Link
            to="/recrutar"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition"
          >
            + Recrutar Herói
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total de Heróis</p>
            <p className="text-2xl font-bold text-cyan-400">{metricas.total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Média de Poder</p>
            <p className="text-2xl font-bold text-amber-400">{metricas.mediaPoder}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Guilda Mais Forte</p>
            <p className="text-lg font-bold text-pink-400">{metricas.guildaMaisForte}</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar herói pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {classes.map((c) => (
            <button
              key={c}
              onClick={() => setFiltroClasse(c)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroClasse === c
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-slate-400">Carregando heróis...</p>}
        {isError && <p className="text-red-400">Erro ao carregar heróis.</p>}
        {herois && herois.length === 0 && (
          <p className="text-slate-400">
            Nenhum herói recrutado ainda. Comece recrutando um!
          </p>
        )}
        {herois && herois.length > 0 && heroisFiltrados.length === 0 && (
          <p className="text-slate-400">Nenhum herói encontrado com esses filtros.</p>
        )}

        {heroisFiltrados.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {heroisFiltrados.map((heroi) => (
                <CardHeroi key={heroi.id} heroi={heroi} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}