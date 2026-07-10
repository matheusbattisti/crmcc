import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { getSessao } from "../../../../lib/auth";

// Aprovar um usuário pendente — só o admin pode.
export async function PATCH(request, { params }) {
  const sessao = await getSessao();
  if (!sessao || sessao.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("usuarios")
    .update({ status: "aprovado" })
    .eq("id", id)
    .select("id, usuario, role, status, criado_em")
    .single();

  if (error) {
    console.error("Erro ao aprovar usuário:", error);
    return NextResponse.json(
      { error: "Não foi possível aprovar o usuário. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
