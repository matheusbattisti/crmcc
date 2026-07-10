// Cria (ou promove) o administrador usando o usuário e a senha já definidos no .env.local.
// A senha não aparece: reaproveita o hash embaralhado (ADMIN_SENHA_HASH).
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const usuario = (process.env.ADMIN_USUARIO || "").trim();
const senha_hash = process.env.ADMIN_SENHA_HASH || "";

if (!usuario || !senha_hash) {
  console.log("Faltam ADMIN_USUARIO ou ADMIN_SENHA_HASH no .env.local.");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const { data: existente } = await supabase
  .from("usuarios")
  .select("id")
  .eq("usuario", usuario)
  .maybeSingle();

if (existente) {
  const { error } = await supabase
    .from("usuarios")
    .update({ role: "admin", status: "aprovado", senha_hash })
    .eq("id", existente.id);
  if (error) { console.log("Erro: " + error.message); process.exit(1); }
  console.log(`Admin '${usuario}' atualizado (role=admin, status=aprovado).`);
} else {
  const { error } = await supabase
    .from("usuarios")
    .insert({ usuario, senha_hash, role: "admin", status: "aprovado" });
  if (error) { console.log("Erro: " + error.message); process.exit(1); }
  console.log(`Admin '${usuario}' criado (role=admin, status=aprovado).`);
}
