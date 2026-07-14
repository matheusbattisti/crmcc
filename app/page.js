import { getSessao } from "../lib/auth";
import AppShell from "./app-shell";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const sessao = await getSessao();

  return (
    <AppShell usuario={sessao?.usuario} role={sessao?.role} larga>
      <DashboardClient />
    </AppShell>
  );
}
