import { getSessao } from "../../lib/auth";
import AppShell from "../app-shell";
import ContatosClient from "./contatos-client";

export default async function Contatos() {
  const sessao = await getSessao();

  return (
    <AppShell usuario={sessao?.usuario} role={sessao?.role}>
      <ContatosClient />
    </AppShell>
  );
}
