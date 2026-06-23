import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RotaProtegida({ children }) {
  const { autenticado } = useAuth();

  // Se não estiver logado, manda pro login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mostra a tela pedida
  return children;
}