import { redirect } from "next/navigation";
import { getSessao } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import AppShell from "../app-shell";
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
    <AppShell usuario={sessao.usuario} role={sessao.role}>
      <UsuariosClient usuariosIniciais={usuarios ?? []} />
    </AppShell>
  );
}
