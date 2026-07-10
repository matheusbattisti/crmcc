import { NextResponse } from "next/server";

// Sair: apaga o cookie da sessão.
export async function POST() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set("crm_sessao", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // expira na hora
  });
  return resposta;
}
