import { getSessao } from "../../lib/auth";
import AppShell from "../app-shell";
import FunilClient from "./funil-client";

export default async function Funil() {
  const sessao = await getSessao();

  return (
    <AppShell usuario={sessao?.usuario} role={sessao?.role} larga>
      <FunilClient />
    </AppShell>
  );
}
