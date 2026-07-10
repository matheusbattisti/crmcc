import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Gera um hash seguro (sal aleatório + scrypt) para guardar no lugar da senha pura.
// Formato salvo: "sal:hash" (em hexadecimal).
export function gerarHashSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  const derivada = scryptSync(senha, sal, 64).toString("hex");
  return `${sal}:${derivada}`;
}

// Confere a senha digitada contra o hash guardado, de forma segura (sem vazar tempo).
export function senhaConfere(senha, armazenado) {
  if (!armazenado || !armazenado.includes(":")) return false;
  const [sal, hashHex] = armazenado.split(":");
  const guardado = Buffer.from(hashHex, "hex");
  const atual = scryptSync(senha, sal, 64);
  return guardado.length === atual.length && timingSafeEqual(guardado, atual);
}
