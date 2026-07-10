import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "../../../lib/supabase";

export async function POST(request) {
  const { contato_id } = await request.json();

  if (!contato_id) {
    return NextResponse.json({ error: "Contato não informado." }, { status: 400 });
  }

  // Busca o contato e o histórico de anotações dele.
  const { data: contato } = await supabase
    .from("contatos")
    .select("nome, etapa")
    .eq("id", contato_id)
    .maybeSingle();

  if (!contato) {
    return NextResponse.json({ error: "Contato não encontrado." }, { status: 404 });
  }

  const { data: anotacoes } = await supabase
    .from("anotacoes")
    .select("texto")
    .eq("contato_id", contato_id)
    .order("id", { ascending: true });

  const historico =
    (anotacoes || []).map((a) => `- ${a.texto}`).join("\n") || "(sem anotações)";

  const sistema =
    "Você escreve mensagens de follow-up para um CRM, em português do Brasil. " +
    "Tom: profissional, caloroso e direto, sem jargão. " +
    "A mensagem deve ser curta (2 a 4 frases), natural e pronta para enviar ao contato. " +
    "Use o nome, a etapa do funil e as anotações para deixá-la coerente com a história do relacionamento. " +
    "Responda APENAS com o texto da mensagem: sem aspas, sem assunto, sem explicações.";

  const usuario = [
    `Nome do contato: ${contato.nome}`,
    `Etapa do funil: ${contato.etapa}`,
    "Anotações (histórico do relacionamento):",
    historico,
    "",
    "Escreva a mensagem de follow-up.",
  ].join("\n");

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const resposta = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: sistema,
      messages: [{ role: "user", content: usuario }],
    });

    const bloco = resposta.content.find((b) => b.type === "text");
    const mensagem = bloco ? bloco.text.trim() : "";

    if (!mensagem) {
      return NextResponse.json(
        { error: "Não foi possível gerar o follow-up. Tente de novo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ mensagem });
  } catch (erro) {
    // Registra o detalhe no servidor, mas devolve mensagem limpa ao usuário.
    console.error("Erro ao gerar follow-up:", erro);
    return NextResponse.json(
      { error: "Não foi possível gerar o follow-up agora. Tente de novo em instantes." },
      { status: 502 }
    );
  }
}
