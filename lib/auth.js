import { cookies } from "next/headers";
import { lerSessao } from "./sessao";

// Lê a sessão atual no servidor (páginas e rotas). Retorna { usuario, role } ou null.
export async function getSessao() {
  const cookieStore = await cookies();
  const token = cookieStore.get("crm_sessao")?.value;
  if (!token) return null;
  return lerSessao(token);
}
