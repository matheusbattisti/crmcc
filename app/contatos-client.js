"use client";

import { useState } from "react";

import { telefoneValido } from "../lib/validacao";
import AnotacoesContato from "./anotacoes-contato";
import FollowupContato from "./followup-contato";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// "em contato" -> "em-contato" (para casar com as classes de cor do design.md)
function classeEtapa(etapa) {
  return etapa.replace(/\s+/g, "-");
}

export default function ContatosClient({ contatosIniciais }) {
  const [contatos, setContatos] = useState(contatosIniciais);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [campoComErro, setCampoComErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroEtapa, setErroEtapa] = useState("");

  // O painel é calculado a partir da própria lista — por isso atualiza sozinho.
  const total = contatos.length;
  const contagem = {};
  for (const e of ETAPAS) {
    contagem[e] = contatos.filter((c) => c.etapa === e).length;
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setCampoComErro("");

    // Sem nome: bloqueia e avisa, sem chamar o servidor.
    if (!nome.trim()) {
      setErro("Informe o nome do contato para salvar.");
      setCampoComErro("nome");
      return;
    }

    // Telefone (se preenchido) precisa estar no formato brasileiro.
    if (!telefoneValido(telefone)) {
      setErro("Telefone inválido. Use o formato brasileiro, ex.: (11) 91234-5678.");
      setCampoComErro("telefone");
      return;
    }

    setSalvando(true);
    try {
      const resposta = await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone }),
      });

      const dado = await resposta.json();

      if (!resposta.ok) {
        setErro(dado.error || "Não foi possível salvar. Tente de novo.");
        return;
      }

      // Entra na lista na hora (no topo) e limpa o formulário. O painel recalcula.
      setContatos([dado, ...contatos]);
      setNome("");
      setEmail("");
      setTelefone("");
    } catch {
      setErro("Não foi possível salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  }

  async function mudarEtapa(id, novaEtapa) {
    setErroEtapa("");
    const anterior = contatos;

    // Atualização otimista: o painel reflete na hora.
    setContatos(contatos.map((c) => (c.id === id ? { ...c, etapa: novaEtapa } : c)));

    try {
      const resposta = await fetch(`/api/contatos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapa: novaEtapa }),
      });
      if (!resposta.ok) {
        setContatos(anterior); // reverte se falhar
        setErroEtapa("Não foi possível mudar a etapa. Tente de novo.");
      }
    } catch {
      setContatos(anterior);
      setErroEtapa("Não foi possível mudar a etapa. Verifique sua conexão.");
    }
  }

  return (
    <>
      <section className="card painel">
        <div className="painel-item">
          <span className="painel-numero">{total}</span>
          <span className="painel-rotulo">Total</span>
        </div>
        {ETAPAS.map((e) => (
          <div key={e} className="painel-item">
            <span className={"painel-numero painel-numero--" + classeEtapa(e)}>
              {contagem[e]}
            </span>
            <span className="painel-rotulo">{e}</span>
          </div>
        ))}
      </section>

      <section className="card">
        <h1 className="section-title">Novo contato</h1>

        <form onSubmit={salvar} noValidate>
          <div className="field">
            <label className="label" htmlFor="nome">Nome</label>
            <input
              id="nome"
              className={"input" + (campoComErro === "nome" ? " input--erro" : "")}
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Maria Oliveira"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@exemplo.com"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              className={"input" + (campoComErro === "telefone" ? " input--erro" : "")}
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 91234-5678"
            />
          </div>

          {erro ? <p className="erro">{erro}</p> : null}

          <button className="botao" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar contato"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="section-title">
          Contatos <span className="contagem">{contatos.length}</span>
        </h2>

        {erroEtapa ? <p className="erro">{erroEtapa}</p> : null}

        {contatos.length === 0 ? (
          <p className="vazio">Nenhum contato ainda. Cadastre o primeiro acima.</p>
        ) : (
          <ul className="lista">
            {contatos.map((contato) => (
              <li key={contato.id} className="lista-item">
                <div className="lista-linha">
                  <div className="lista-info">
                    <span className="lista-nome">{contato.nome}</span>
                    <span className="lista-contato">
                      {contato.email || "—"} · {contato.telefone || "—"}
                    </span>
                  </div>
                  <select
                    className={"etapa-select etapa-select--" + classeEtapa(contato.etapa)}
                    value={contato.etapa}
                    onChange={(e) => mudarEtapa(contato.id, e.target.value)}
                    aria-label="Etapa do funil"
                  >
                    {ETAPAS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
                <AnotacoesContato contatoId={contato.id} />
                <FollowupContato contatoId={contato.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
