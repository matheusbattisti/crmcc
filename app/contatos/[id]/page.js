import { getSessao } from "../../../lib/auth";
import AppShell from "../../app-shell";
import ContatoClient from "./contato-client";

export default async function PaginaContato({ params }) {
  const { id } = await params;
  const sessao = await getSessao();

  return (
    <AppShell usuario={sessao?.usuario} role={sessao?.role}>
      <ContatoClient contatoId={id} />
    </AppShell>
  );
}
