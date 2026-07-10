import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

// Editar o texto de uma anotação.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const corpo = await request.json();
  const texto = (corpo.texto || "").trim();

  if (!texto) {
    return NextResponse.json(
      { error: "A anotação não pode estar vazia." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .update({ texto })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao editar anotação:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a anotação. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// Excluir uma anotação.
export async function DELETE(request, { params }) {
  const { id } = await params;

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir anotação:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir a anotação. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
