import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function CardHeroi({ heroi }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const dispensar = useMutation({
    mutationFn: async () => {
      await api.delete(`/herois/${heroi.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["herois"] });
      toast.success("Herói dispensado!");
    },
  });

  const ajustarPoder = useMutation({
    mutationFn: async (delta) => {
      const novoNivel = Math.min(100, Math.max(0, heroi.nivel_poder + delta));
      await api.put(`/herois/${heroi.id}`, {
        nome: heroi.nome,
        classe: heroi.classe,
        nivel_poder: novoNivel,
        url_avatar: heroi.url_avatar,
        guilda_id: heroi.guilda_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["herois"] });
      toast.success("Poder atualizado!");
    },
  });

  function corPatente() {
    if (heroi.nivel_poder >= 80) return "border-amber-400";
    if (heroi.nivel_poder >= 50) return "border-cyan-400";
    return "border-slate-700";
  }

  const blocosAcesos = Math.round(heroi.nivel_poder / 10);

  function usarReserva(e) {
    e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${heroi.nome}`;
  }

  return (
    <div className={`bg-slate-900 border-2 ${corPatente()} rounded-2xl p-5 transition hover:scale-[1.02]`}>
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/heroi/${heroi.id}`)}
      >
        <img
          src={heroi.url_avatar}
          alt={heroi.nome}
          onError={usarReserva}
          className="w-16 h-16 rounded-full object-cover bg-slate-800"
        />
        <div>
          <h3 className="font-bold text-lg text-white">{heroi.nome}</h3>
          <p className="text-sm text-cyan-400">{heroi.classe}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Nível de Poder</span>
          <span className="text-amber-400 font-bold">{heroi.nivel_poder}/100</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm transition ${
                i < blocosAcesos ? "bg-amber-400" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => ajustarPoder.mutate(10)}
          disabled={ajustarPoder.isPending || heroi.nivel_poder >= 100}
          className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded-lg transition disabled:opacity-40"
        >
          +10 Poder
        </button>
        <button
          onClick={() => ajustarPoder.mutate(-10)}
          disabled={ajustarPoder.isPending || heroi.nivel_poder <= 0}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 rounded-lg transition disabled:opacity-40"
        >
          −10 Poder
        </button>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Guilda: <span className="text-pink-400">{heroi.guilda_nome}</span>
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => toast.success(`${heroi.nome} foi convocado para o seu time!`)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition"
        >
          Recrutar
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/heroi/${heroi.id}`)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-lg transition"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => {
              if (confirm(`Dispensar ${heroi.nome}?`)) dispensar.mutate();
            }}
            disabled={dispensar.isPending}
            className="bg-slate-800 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            Dispensar
          </button>
        </div>
      </div>
    </div>
  );
}