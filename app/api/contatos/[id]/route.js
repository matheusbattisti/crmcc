import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// Muda a etapa do funil de um contato.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const { etapa } = await request.json();

  if (!ETAPAS.includes(etapa)) {
    return NextResponse.json({ error: "Etapa inválida." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contatos")
    .update({ etapa })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar contato:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o contato. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
