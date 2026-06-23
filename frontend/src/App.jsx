import { Routes, Route, Navigate } from "react-router-dom";
import RotaProtegida from "./components/RotaProtegida.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recrutamento from "./pages/Recrutamento.jsx";
import DetalhesHeroi from "./pages/DetalhesHeroi.jsx";
import Perfil from "./pages/Perfil.jsx";

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas protegidas */}
      <Route path="/" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/recrutar" element={<RotaProtegida><Recrutamento /></RotaProtegida>} />
      <Route path="/heroi/:id" element={<RotaProtegida><DetalhesHeroi /></RotaProtegida>} />
      <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />

      {/* Qualquer rota desconhecida volta pra home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}