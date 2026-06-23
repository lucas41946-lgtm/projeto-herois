import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializa lendo o que já estiver salvo no localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });

  // Chamado após login bem-sucedido
  function login(novoToken, dadosUsuario) {
    localStorage.setItem("token", novoToken);
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    setToken(novoToken);
    setUsuario(dadosUsuario);
  }

  // Limpa tudo e desloga
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  const autenticado = !!token;

  return (
    <AuthContext.Provider value={{ token, usuario, autenticado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado pra facilitar o uso nas telas
export function useAuth() {
  return useContext(AuthContext);
}