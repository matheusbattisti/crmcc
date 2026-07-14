import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// Busca um contato pelo id (usada pela página do contato).
export async function GET(_request, { params }) {
  const { id } = await params;

  // Id precisa ser numérico — qualquer outra coisa é "não encontrado".
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("contatos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar contato:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o contato. Tente de novo." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });
  }

  return NextResponse.json(data);
}

// Muda a etapa do funil de um contato.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const { etapa } = await request.json();

  // Id precisa ser numérico — qualquer outra coisa é "não encontrado".
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });
  }

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
