import { createInterface } from "node:readline";
import { gerarHashSenha } from "./lib/senha.js";

// Gera o hash da sua senha, para colar no .env.local.
// A senha NÃO é salva em lugar nenhum — só o hash embaralhado é mostrado.
const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log("Gerador de senha do CRM");
console.log("A senha não fica guardada; só o hash embaralhado é gerado.\n");

rl.question("Digite a senha que você quer usar: ", (senha) => {
  const limpa = (senha || "").trim();
  if (!limpa) {
    console.log("\nSenha vazia. Rode de novo e digite uma senha.");
    rl.close();
    return;
  }
  const hash = gerarHashSenha(limpa);
  console.log("\nPronto! Cole a linha abaixo no .env.local:\n");
  console.log("ADMIN_SENHA_HASH=" + hash + "\n");
  rl.close();
});
