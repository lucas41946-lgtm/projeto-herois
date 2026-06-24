import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const resposta = await api.post("/auth/login", { email, senha });
      return resposta.data;
    },
    onSuccess: (data) => {
      login(data.token, data.usuario);
      toast.success("Bem-vindo de volta!");
      navigate("/");
    },
  });

  function handleSubmit() {
    mutation.mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Portal de <span className="text-cyan-400">Heróis</span>
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="bg-slate-800 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {mutation.isError && (
            <p className="text-red-400 text-sm">
              {mutation.error?.response?.data?.erro || "Erro ao fazer login"}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-slate-400 text-sm">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-cyan-400 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}