import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { telefoneValido } from "../../../lib/validacao";

// Porta de entrada no servidor para salvar um contato.
// Roda só no servidor, então pode usar a chave secreta com segurança.
export async function POST(request) {
  const corpo = await request.json();

  const nome = (corpo.nome || "").trim();
  const email = (corpo.email || "").trim();
  const telefone = (corpo.telefone || "").trim();

  // Nome é obrigatório — barra aqui também, além do aviso na tela.
  if (!nome) {
    return NextResponse.json(
      { error: "O nome é obrigatório." },
      { status: 400 }
    );
  }

  // Telefone (se preenchido) precisa estar no formato brasileiro.
  if (!telefoneValido(telefone)) {
    return NextResponse.json(
      { error: "Telefone inválido. Use o formato brasileiro." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("contatos")
    .insert({
      nome,
      email: email || null,
      telefone: telefone || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar contato:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o contato. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
