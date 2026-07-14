"use client";

import { useEffect, useState } from "react";

import { formatarData } from "../../../lib/datas";

export default function FollowupsContato({ contatoId }) {
  const [followups, setFollowups] = useState(null); // null = ainda carregando
  const [erro, setErro] = useState("");
  const [gerando, setGerando] = useState(false);
  const [copiadoId, setCopiadoId] = useState(null);

  useEffect(() => {
    let ativo = true;
    fetch(`/api/followup?contato_id=${contatoId}`)
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => {
        if (ativo) setFollowups(dados);
      })
      .catch(() => {
        if (ativo) {
          setFollowups([]);
          setErro("Não foi possível carregar os follow-ups.");
        }
      });
    return () => {
      ativo = false;
    };
  }, [contatoId]);

  async function gerar() {
    setGerando(true);
    setErro("");
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

      // O follow-up recém-gerado entra no topo da lista, já salvo no banco.
      setFollowups([dado, ...(followups || [])]);
    } catch {
      setErro("Não foi possível gerar o follow-up. Verifique sua conexão.");
    } finally {
      setGerando(false);
    }
  }

  async function copiar(followup) {
    try {
      await navigator.clipboard.writeText(followup.mensagem);
      setCopiadoId(followup.id);
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      setErro("Não foi possível copiar. Selecione o texto e copie manualmente.");
    }
  }

  return (
    <div>
      <button
        type="button"
        className="botao botao--pequeno"
        onClick={gerar}
        disabled={gerando}
      >
        {gerando ? "IA escrevendo..." : "Gerar follow-up com IA"}
      </button>

      {erro ? <p className="erro followup-erro">{erro}</p> : null}

      {followups === null ? (
        <p className="anotacoes-status followup-lista-status">Carregando...</p>
      ) : followups.length === 0 ? (
        <p className="anotacoes-status followup-lista-status">
          Nenhum follow-up gerado ainda.
        </p>
      ) : (
        <ul className="anotacoes-lista followup-lista">
          {followups.map((followup) => (
            <li key={followup.id} className="anotacoes-item">
              <p className="anotacoes-texto">{followup.mensagem}</p>
              <div className="anotacoes-rodape">
                <span className="anotacoes-data">
                  {formatarData(followup.criado_em)}
                </span>
                <button
                  type="button"
                  className="botao-texto"
                  onClick={() => copiar(followup)}
                >
                  {copiadoId === followup.id ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
