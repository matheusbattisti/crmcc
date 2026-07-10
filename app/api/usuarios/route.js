import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getSessao } from "../../../lib/auth";

// Lista os usuários — só o admin pode ver.
export async function GET() {
  const sessao = await getSessao();
  if (!sessao || sessao.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("id, usuario, role, status, criado_em")
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao carregar usuários:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os usuários. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
