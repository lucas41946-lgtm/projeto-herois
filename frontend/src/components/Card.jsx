// Importa o badge (peça menor) que vai dentro do cartão
import StatusBadge from "./StatusBadge";
import { useState } from "react";

// Define que o cartão recebe um objeto heroi
function Card({ heroi, excluirHeroi }) {
  const [xpBlocos, setXpBlocos] = useState(0);
  const [nivel, setNivel] = useState(1);


  const ganharXp = () => {
    if (xpBlocos < 9) {
      setXpBlocos(xpBlocos + 1);
    } else {
      setXpBlocos(0);
      setNivel(nivel + 1);
    }
  };


function patente() {
  if (nivel >= 5 && nivel < 10) {
    return "1px solid #CE8946";
  } if (nivel >= 10 && nivel < 15) {
    return "1px solid #C0C0C0";
  } if (nivel >= 15) {
    return "1px solid #FFC300";
  }
};

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    margin: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "200px",
    border: patente(),
  };

  const btnStyle = {
    border: "1px solid #404040",
    borderRadius: "12px",
    backgroundColor: "#009c68",
    color: "white",
    padding: "6px",
    margin: "6px",
    cursor: "pointer",
  };

  const btnDeleteStyle = {
    border: "1px solid #404040",
    borderRadius: "12px",
    backgroundColor: "#c90036",
    color: "white",
    padding: "6px",
    margin: "6px",
    cursor: "pointer",
  };

  const btnXp = {
    border: "1px solid #404040",
    borderRadius: "12px",
    backgroundColor: "#2699e6",
    color: "white",
    padding: "6px",
    width: "100%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  };

  // Estrutura HTML (JSX)
  return (
    <div style={cardStyle}>
      <div className="flex justify-center mb-4">
        <StatusBadge tipo={heroi.status} />
      
      </div>
    <p>Nível: {nivel}</p>
    <p>XP: {xpBlocos}/10</p>

      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: "20px",
              margin: "2px",
              borderRadius: "4px",
              backgroundColor: i < xpBlocos ? "#23d60f" : "#ddd",
              transition: "0.3s",
             
            }}
          />
        ))}
      </div>

      <img
        src={heroi.imagem}
        alt={heroi.nome}
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h2>{heroi.nome}</h2>
      <p>Classe: {heroi.classe}</p>

      <button
        style={btnStyle}
        onClick={() => alert(`Você recrutou ${heroi.nome} para o seu time!`)}
      >
        Recrutar!
      </button>

      <button style={btnDeleteStyle} onClick={() => excluirHeroi(heroi.id)}>
        Excluir
      </button>

      <button style={btnXp} onClick={ganharXp}>Ganhar XP!</button>
    </div>
  );
}

// Exporta o Card
export default Card;
