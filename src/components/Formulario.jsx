import { useState } from "react";

function Formulario({ onCadastrar }) {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");

  function inserirDados(evento) {
    evento.preventDefault();

    if (!nome || !classe) { {/*valida se os campos estão vazios e retorna uma mensagem*/}
      alert("Preencha todos os campos!");
      return;
    }

    onCadastrar(nome, classe); //pega os dados do formulário e adiciona o novo herói na lista

    setNome(""); //limpa o input dps q eu envio o form
    setClasse("");
  }

  const cadastrar = {
    textAlign: "center", 
    margin: "20px"
  }

  const title = {
    fontSize: "1.5rem",
    marginBottom: "10px",
  }


  return (
    <div style={cadastrar}>
      <h1 style={title}><strong>Cadastrar herói<strong/></strong></h1>

      <form onSubmit={inserirDados}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          style={{ margin: "10px", padding: "8px", border: "1px solid black", borderRadius: "5px", boxShadow: "0 8px 6px -6px rgba(0, 0, 0, 0.3)"}}
        />
<br />
        <input
          type="text"
          placeholder="Classe"
          value={classe}
          onChange={(evento) => setClasse(evento.target.value)}
          style={{ margin: "5px", padding: "8px", border: "1px solid black", borderRadius: "5px", boxShadow: "0 8px 6px -6px rgba(0, 0, 0, 0.3)"}}
        />
<br />
        <button style={{border: "1px solid black", padding: "10px", margin: "10px", width: "200px", borderRadius: "5px", color: "white", backgroundColor: "#00c000", boxShadow: "0 8px 6px -6px rgba(0, 0, 0, 0.3)"}} 
        type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Formulario;