import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // QUERY: busca os heróis do recrutador logado
  const { data: herois, isLoading, isError } = useQuery({
    queryKey: ["herois"],
    queryFn: async () => {
      const resposta = await api.get("/herois");
      return resposta.data;
    },
  });

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Cabeçalho */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Bem-vindo, Recrutador{" "}
          <span className="text-cyan-400">{usuario?.nome_completo}</span>
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/perfil"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
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

        {/* Estado de carregamento */}
        {isLoading && <p className="text-slate-400">Carregando heróis...</p>}

        {/* Estado de erro */}
        {isError && <p className="text-red-400">Erro ao carregar heróis.</p>}

        {/* Lista vazia */}
        {herois && herois.length === 0 && (
          <p className="text-slate-400">
            Nenhum herói recrutado ainda. Comece recrutando um!
          </p>
        )}

        {/* Galeria de heróis */}
        {herois && herois.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {herois.map((heroi) => (
              <Link
                key={heroi.id}
                to={`/heroi/${heroi.id}`}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={heroi.url_avatar}
                    alt={heroi.nome}
                    className="w-16 h-16 rounded-full object-cover bg-slate-800"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{heroi.nome}</h3>
                    <p className="text-sm text-slate-400">{heroi.classe}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-amber-400">
                    Poder: {heroi.nivel_poder}
                  </span>
                  <span className="text-slate-400">{heroi.guilda_nome}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}