import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Perfil() {
  const { login, token } = useAuth();

  // Estados dos dados
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Estados da troca de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");

  // Busca os dados do perfil
  const { data: perfil } = useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const resposta = await api.get("/perfil");
      return resposta.data;
    },
  });

  // Preenche os campos quando o perfil carrega
  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome_completo);
      setEmail(perfil.email);
    }
  }, [perfil]);

  // Mutation: atualizar dados
  const atualizarDados = useMutation({
    mutationFn: async () => {
      const resposta = await api.put("/perfil", {
        nome_completo: nome,
        email,
      });
      return resposta.data;
    },
    onSuccess: (data) => {
      // Atualiza o contexto pra o nome no cabeçalho mudar na hora
      login(token, data);
    },
  });

  // Mutation: trocar senha
  const trocarSenha = useMutation({
    mutationFn: async () => {
      await api.put("/perfil/senha", {
        senha_atual: senhaAtual,
        senha_nova: senhaNova,
      });
    },
    onSuccess: () => {
      setSenhaAtual("");
      setSenhaNova("");
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Configurações de Perfil</h1>
        <Link to="/" className="text-slate-300 hover:text-cyan-400 transition">
          ← Voltar
        </Link>
      </header>

      <main className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        {/* Dados do perfil */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Dados da Conta</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400">Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
              />
            </div>

            {atualizarDados.isError && (
              <p className="text-red-400 text-sm">
                {atualizarDados.error?.response?.data?.erro || "Erro ao salvar"}
              </p>
            )}
            {atualizarDados.isSuccess && (
              <p className="text-green-400 text-sm">Dados atualizados com sucesso!</p>
            )}

            <button
              onClick={() => atualizarDados.mutate()}
              disabled={atualizarDados.isPending}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50 mt-2"
            >
              {atualizarDados.isPending ? "Salvando..." : "Salvar Dados"}
            </button>
          </div>
        </div>

        {/* Troca de senha */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-slate-400">Senha atual</label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Nova senha (mínimo 6 caracteres)</label>
              <input
                type="password"
                value={senhaNova}
                onChange={(e) => setSenhaNova(e.target.value)}
                className="w-full bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 mt-1"
              />
            </div>

            {trocarSenha.isError && (
              <p className="text-red-400 text-sm">
                {trocarSenha.error?.response?.data?.erro || "Erro ao trocar senha"}
              </p>
            )}
            {trocarSenha.isSuccess && (
              <p className="text-green-400 text-sm">Senha alterada com sucesso!</p>
            )}

            <button
              onClick={() => trocarSenha.mutate()}
              disabled={trocarSenha.isPending}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50 mt-2"
            >
              {trocarSenha.isPending ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}