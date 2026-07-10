"use client";

import { useState } from "react";

export default function FollowupContato({ contatoId }) {
  const [gerando, setGerando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function gerar() {
    setGerando(true);
    setErro("");
    setCopiado(false);
    try {
      const resposta = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contato_id: contatoId }),
      });
      const dado = await resposta.json();

      if (!resposta.ok) {
        setErro(dado.error || "Não foi possível gerar o follow-up. Tente de novo.");
        return;
      }

      setMensagem(dado.mensagem);
    } catch {
      setErro("Não foi possível gerar o follow-up. Verifique sua conexão.");
    } finally {
      setGerando(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErro("Não foi possível copiar. Selecione o texto e copie manualmente.");
    }
  }

  return (
    <div className="followup">
      <button
        type="button"
        className="botao-texto"
        onClick={gerar}
        disabled={gerando}
      >
        {gerando
          ? "IA escrevendo..."
          : mensagem
          ? "Gerar outro follow-up"
          : "Gerar follow-up"}
      </button>

      {erro ? <p className="erro followup-erro">{erro}</p> : null}

      {mensagem ? (
        <div className="followup-caixa">
          <p className="followup-mensagem">{mensagem}</p>
          <button type="button" className="botao botao--pequeno" onClick={copiar}>
            {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
