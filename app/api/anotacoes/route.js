import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// Lê as anotações de UM contato (as mais recentes primeiro).
export async function GET(request) {
  const contatoId = request.nextUrl.searchParams.get("contato_id");

  if (!contatoId) {
    return NextResponse.json(
      { error: "contato_id é obrigatório." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .select("*")
    .eq("contato_id", contatoId)
    .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao carregar anotações:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as anotações. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// Salva uma nova anotação para um contato.
export async function POST(request) {
  const corpo = await request.json();

  const contatoId = corpo.contato_id;
  const texto = (corpo.texto || "").trim();

  if (!contatoId) {
    return NextResponse.json(
      { error: "contato_id é obrigatório." },
      { status: 400 }
    );
  }

  if (!texto) {
    return NextResponse.json(
      { error: "A anotação não pode estar vazia." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .insert({ contato_id: contatoId, texto })
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar anotação:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a anotação. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
