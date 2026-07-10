import { redirect } from "next/navigation";
import { getSessao } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import Navbar from "../navbar";
import UsuariosClient from "./usuarios-client";

export const dynamic = "force-dynamic";

export default async function Usuarios() {
  const sessao = await getSessao();

  // Área só do admin.
  if (!sessao) redirect("/login");
  if (sessao.role !== "admin") redirect("/");

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, usuario, role, status, criado_em")
    .order("id", { ascending: true });

  return (
    <div className="page">
      <Navbar usuario={sessao.usuario} role={sessao.role} />
      <main className="main">
        <div className="app">
          <UsuariosClient usuariosIniciais={usuarios ?? []} />
        </div>
      </main>
    </div>
  );
}
