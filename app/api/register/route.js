import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { gerarHashSenha } from "../../../lib/senha";

// Cadastro público: cria um usuário sempre como "pendente" e papel "user".
export async function POST(request) {
  const { usuario, senha } = await request.json();
  const nomeUsuario = (usuario || "").trim();

  if (!nomeUsuario || !senha) {
    return NextResponse.json(
      { error: "Preencha usuário e senha." },
      { status: 400 }
    );
  }
  if (senha.length < 6) {
    return NextResponse.json(
      { error: "A senha precisa ter ao menos 6 caracteres." },
      { status: 400 }
    );
  }

  const { data: existente } = await supabase
    .from("usuarios")
    .select("id")
    .eq("usuario", nomeUsuario)
    .maybeSingle();

  if (existente) {
    return NextResponse.json(
      { error: "Esse usuário já existe. Escolha outro." },
      { status: 409 }
    );
  }

  const senha_hash = gerarHashSenha(senha);
  const { error } = await supabase.from("usuarios").insert({
    usuario: nomeUsuario,
    senha_hash,
    role: "user",
    status: "pendente",
  });

  if (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { error: "Não foi possível concluir o cadastro. Tente de novo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
