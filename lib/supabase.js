import { createClient } from "@supabase/supabase-js";

// Ligação com o Supabase — usada SÓ no servidor (usa a chave secreta).
// Os valores vêm do arquivo de segredos .env.local; nada fica escrito no código.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Faltam SUPABASE_URL ou SUPABASE_SECRET_KEY no arquivo .env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
