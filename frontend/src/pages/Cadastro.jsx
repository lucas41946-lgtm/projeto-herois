import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Cadastro() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const resposta = await api.post("/auth/cadastro", {
        nome_completo: nomeCompleto,
        email,
        senha,
      });
      return resposta.data;
    },
    onSuccess: () => {
      navigate("/login"); // após cadastrar, vai pro login
    },
  });

  function handleSubmit() {
    mutation.mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Criar <span className="text-cyan-400">Conta</span>
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            className="bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {mutation.isError && (
            <p className="text-red-400 text-sm">
              {mutation.error?.response?.data?.erro || "Erro ao cadastrar"}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {mutation.isPending ? "Criando..." : "Cadastrar"}
          </button>

          <p className="text-center text-slate-400 text-sm">
            Já tem conta?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}