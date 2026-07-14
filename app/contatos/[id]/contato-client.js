"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { tempoDesde } from "../../../lib/datas";
import AnotacoesContato from "../../anotacoes-contato";
import FollowupsContato from "./followups-contato";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// "em contato" -> "em-contato" (para casar com as classes de cor do design.md)
function classeEtapa(etapa) {
  return etapa.replace(/\s+/g, "-");
}

export default function ContatoClient({ contatoId }) {
  const [contato, setContato] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoExiste, setNaoExiste] = useState(false);
  const [erroCarga, setErroCarga] = useState("");
  const [erroEtapa, setErroEtapa] = useState("");

  useEffect(() => {
    let ativo = true;
    fetch(`/api/contatos/${contatoId}`)
      .then(async (resposta) => {
        if (!ativo) return;
        if (resposta.status === 404) {
          setNaoExiste(true);
          return;
        }
        if (!resposta.ok) {
          setErroCarga("Não foi possível carregar o contato. Recarregue a página.");
          return;
        }
        setContato(await resposta.json());
      })
      .catch(() => {
        if (ativo) {
          setErroCarga("Não foi possível carregar o contato. Verifique sua conexão.");
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [contatoId]);

  async function mudarEtapa(novaEtapa) {
    setErroEtapa("");
    const anterior = contato;

    // Atualização otimista: a etiqueta muda na hora.
    setContato({ ...contato, etapa: novaEtapa });

    try {
      const resposta = await fetch(`/api/contatos/${contatoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapa: novaEtapa }),
      });
      if (!resposta.ok) {
        setContato(anterior); // reverte se falhar
        setErroEtapa("Não foi possível mudar a etapa. Tente de novo.");
      }
    } catch {
      setContato(anterior);
      setErroEtapa("Não foi possível mudar a etapa. Verifique sua conexão.");
    }
  }

  if (carregando) {
    return <p className="vazio">Carregando contato…</p>;
  }

  if (naoExiste) {
    return (
      <section className="card">
        <h1 className="section-title">Contato não encontrado</h1>
        <p className="aviso">Este contato não existe mais (pode ter sido removido).</p>
        <Link className="botao" href="/funil">
          Voltar ao Funil
        </Link>
      </section>
    );
  }

  if (erroCarga) {
    return <p className="erro">{erroCarga}</p>;
  }

  return (
    <>
      <div>
        <Link className="botao-texto" href="/funil">
          ← Voltar ao Funil
        </Link>
      </div>

      <section className="card">
        <div className="contato-topo">
          <div>
            <h1 className="contato-nome">{contato.nome}</h1>
            <p className="contato-dados">
              {contato.email || "—"} · {contato.telefone || "—"}
            </p>
            <p className="contato-tempo">cadastrado {tempoDesde(contato.criado_em)}</p>
          </div>
          <select
            className={"etapa-select etapa-select--" + classeEtapa(contato.etapa)}
            value={contato.etapa}
            onChange={(e) => mudarEtapa(e.target.value)}
            aria-label="Etapa do funil"
          >
            {ETAPAS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        {erroEtapa ? <p className="erro contato-erro-etapa">{erroEtapa}</p> : null}
      </section>

      <section className="card">
        <h2 className="section-title">Anotações</h2>
        <AnotacoesContato contatoId={contato.id} />
      </section>

      <section className="card">
        <h2 className="section-title">Follow-ups</h2>
        <FollowupsContato contatoId={contato.id} />
      </section>
    </>
  );
}
