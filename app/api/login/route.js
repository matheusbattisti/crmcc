import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { senhaConfere } from "../../../lib/senha";
import { criarSessao } from "../../../lib/sessao";

export async function POST(request) {
  const { usuario, senha } = await request.json();

  const { data: conta } = await supabase
    .from("usuarios")
    .select("*")
    .eq("usuario", (usuario || "").trim())
    .maybeSingle();

  const senhaOk = conta && senhaConfere(senha || "", conta.senha_hash);

  // Mensagem genérica de propósito: não revela o que estava errado.
  if (!conta || !senhaOk) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  if (conta.status !== "aprovado") {
    return NextResponse.json(
      { error: "Sua conta está pendente de aprovação pelo administrador." },
      { status: 403 }
    );
  }

  const token = await criarSessao({ usuario: conta.usuario, role: conta.role });
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set("crm_sessao", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
  return resposta;
}
