"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { tempoDesde } from "../lib/datas";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// "em contato" -> "em-contato" (para casar com as classes de cor do design.md)
function classeEtapa(etapa) {
  return etapa.replace(/\s+/g, "-");
}

export default function DashboardClient() {
  const [contatos, setContatos] = useState(null); // null = ainda carregando
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    fetch("/api/contatos")
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => {
        if (ativo) setContatos(dados);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os números. Recarregue a página.");
      });
    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  if (contatos === null) {
    return <p className="vazio">Carregando números…</p>;
  }

  const total = contatos.length;
  const contagem = {};
  for (const e of ETAPAS) {
    contagem[e] = contatos.filter((c) => c.etapa === e).length;
  }
  // A maior barra do gráfico ocupa a trilha inteira; as outras são proporcionais.
  const maximo = Math.max(...ETAPAS.map((e) => contagem[e]), 1);
  const recentes = contatos.slice(0, 5); // a API já devolve do mais novo pro mais antigo

  return (
    <>
      <div className="dash-grid">
        <div className="card dash-card">
          <span className="painel-numero">{total}</span>
          <span className="painel-rotulo">Total</span>
        </div>
        {ETAPAS.map((e) => (
          <div key={e} className="card dash-card">
            <span className={"painel-numero painel-numero--" + classeEtapa(e)}>
              {contagem[e]}
            </span>
            <span className="painel-rotulo">{e}</span>
          </div>
        ))}
      </div>

      <div className="dash-duplo">
        <section className="card">
          <h2 className="section-title">Distribuição do funil</h2>
          {total === 0 ? (
            <p className="vazio">
              Nenhum contato ainda. O gráfico aparece com o primeiro cadastro.
            </p>
          ) : (
            <div className="grafico">
              {ETAPAS.map((e) => (
                <div key={e} className="grafico-linha">
                  <span className="grafico-rotulo">{e}</span>
                  <div className="grafico-trilha">
                    <div
                      className={"grafico-barra grafico-barra--" + classeEtapa(e)}
                      style={{ width: `${(contagem[e] / maximo) * 100}%` }}
                    />
                  </div>
                  <span className="grafico-valor">{contagem[e]}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="section-title">Últimos contatos</h2>
          {recentes.length === 0 ? (
            <p className="vazio">Nenhum contato cadastrado ainda.</p>
          ) : (
            <ul className="dash-recentes">
              {recentes.map((contato) => (
                <li key={contato.id}>
                  <Link className="dash-recente" href={`/contatos/${contato.id}`}>
                    <div className="lista-info">
                      <span className="lista-nome">{contato.nome}</span>
                      <span className="lista-contato">
                        {contato.email || "—"} · cadastrado{" "}
                        {tempoDesde(contato.criado_em)}
                      </span>
                    </div>
                    <span className={"badge badge--" + classeEtapa(contato.etapa)}>
                      {contato.etapa}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
