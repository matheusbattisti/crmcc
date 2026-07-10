import { supabase } from "../lib/supabase";
import ContatosClient from "./contatos-client";
import Navbar from "./navbar";
import { getSessao } from "../lib/auth";

// Busca sempre a versão mais recente do banco a cada abertura da página.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sessao = await getSessao();

  const { data: contatos } = await supabase
    .from("contatos")
    .select("*")
    .order("id", { ascending: false }); // mais recentes primeiro

  return (
    <div className="page">
      <Navbar usuario={sessao?.usuario} role={sessao?.role} />

      <main className="main">
        <div className="app">
          <ContatosClient contatosIniciais={contatos ?? []} />
        </div>
      </main>
    </div>
  );
}
