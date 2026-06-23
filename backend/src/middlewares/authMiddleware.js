import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
  // 1. Pega o cabeçalho Authorization
  const cabecalho = req.headers.authorization;

  if (!cabecalho) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  // 2. O formato esperado é "Bearer <token>" — separamos as duas partes
  const partes = cabecalho.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({ erro: "Formato de token inválido" });
  }
  const token = partes[1];

  // 3. Verifica a assinatura do token
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Anexa os dados do usuário na requisição
    req.usuario = dados;
    next(); // libera a passagem pro controller
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}