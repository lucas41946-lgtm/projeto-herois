CREATE DATABASE IF NOT EXISTS portal_herois;
USE portal_herois;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guildas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE herois (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  classe ENUM('Mago','Guerreiro','Arqueiro','Ladino') NOT NULL,
  nivel_poder INT NOT NULL,
  url_avatar VARCHAR(500),
  guilda_id INT NOT NULL,
  usuario_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guilda_id) REFERENCES guildas(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE missoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  status ENUM('Em andamento','Concluída','Falhou') DEFAULT 'Em andamento',
  recompensa_ouro INT DEFAULT 0,
  heroi_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (heroi_id) REFERENCES herois(id) ON DELETE CASCADE
);

INSERT INTO guildas (nome) VALUES ('Ordem do Dragão'), ('Lâminas Sombrias'), ('Guardiões da Aurora');