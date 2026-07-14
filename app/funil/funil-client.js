"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { telefoneValido, emailValido } from "../../lib/validacao";
import { tempoDesde } from "../../lib/datas";

const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// "em contato" -> "em-contato" (para casar com as classes de cor do design.md)
function classeEtapa(etapa) {
  return etapa.replace(/\s+/g, "-");
}

export default function FunilClient() {
  const router = useRouter();
  const [contatos, setContatos] = useState(null); // null = ainda carregando
  const [erroCarga, setErroCarga] = useState("");
  const [erroEtapa, setErroEtapa] = useState("");
  const [colunaAlvo, setColunaAlvo] = useState("");

  // Cadastro de novo contato (modal)
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroForm, setErroForm] = useState("");
  const [campoComErro, setCampoComErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    fetch("/api/contatos")
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => {
        if (ativo) setContatos(dados);
      })
      .catch(() => {
        if (ativo) {
          setErroCarga("Não foi possível carregar os contatos. Recarregue a página.");
        }
      });
    return () => {
      ativo = false;
    };
  }, []);

  async function mudarEtapa(id, novaEtapa) {
    setErroEtapa("");
    const anterior = contatos;

    // Atualização otimista: o cartão troca de coluna na hora.
    setContatos(contatos.map((c) => (c.id === id ? { ...c, etapa: novaEtapa } : c)));

    try {
      const resposta = await fetch(`/api/contatos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapa: novaEtapa }),
      });
      if (!resposta.ok) {
        setContatos(anterior); // reverte: o cartão volta pra coluna original
        setErroEtapa("Não foi possível mudar a etapa. Tente de novo.");
      }
    } catch {
      setContatos(anterior);
      setErroEtapa("Não foi possível mudar a etapa. Verifique sua conexão.");
    }
  }

  function aoSoltar(evento, etapa) {
    evento.preventDefault();
    setColunaAlvo("");
    const id = Number(evento.dataTransfer.getData("text/plain"));
    if (!id) return;
    const contato = contatos.find((c) => c.id === id);
    if (!contato || contato.etapa === etapa) return;
    mudarEtapa(id, etapa);
  }

  function abrirModal() {
    setNome("");
    setEmail("");
    setTelefone("");
    setErroForm("");
    setCampoComErro("");
    setModalAberto(true);
  }

  async function salvar(evento) {
    evento.preventDefault();
    setErroForm("");
    setCampoComErro("");

    // Sem nome: bloqueia e avisa, sem chamar o servidor.
    if (!nome.trim()) {
      setErroForm("Informe o nome do contato para salvar.");
      setCampoComErro("nome");
      return;
    }

    // Telefone (se preenchido) precisa estar no formato brasileiro.
    if (!telefoneValido(telefone)) {
      setErroForm("Telefone inválido. Use o formato brasileiro, ex.: (11) 91234-5678.");
      setCampoComErro("telefone");
      return;
    }

    // Email (se preenchido) precisa ter formato de email.
    if (!emailValido(email)) {
      setErroForm("Email inválido. Confira o formato, ex.: maria@exemplo.com.");
      setCampoComErro("email");
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
        setErroForm(dado.error || "Não foi possível salvar. Tente de novo.");
        return;
      }

      // Entra na coluna "novo" na hora; o contador recalcula sozinho.
      setContatos([dado, ...contatos]);
      setModalAberto(false);
    } catch {
      setErroForm("Não foi possível salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="kanban-topo">
        <h1 className="section-title">Funil</h1>
        <button type="button" className="botao" onClick={abrirModal}>
          Novo contato
        </button>
      </div>

      {erroEtapa ? <p className="erro">{erroEtapa}</p> : null}

      {erroCarga ? (
        <p className="erro">{erroCarga}</p>
      ) : contatos === null ? (
        <p className="vazio">Carregando contatos…</p>
      ) : (
        <div className="kanban">
          {ETAPAS.map((etapa) => {
            const daColuna = contatos.filter((c) => c.etapa === etapa);
            return (
              <section
                key={etapa}
                className={
                  "kanban-coluna" +
                  (colunaAlvo === etapa ? " kanban-coluna--alvo" : "")
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  if (colunaAlvo !== etapa) setColunaAlvo(etapa);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setColunaAlvo("");
                }}
                onDrop={(e) => aoSoltar(e, etapa)}
              >
                <header className="kanban-cabecalho">
                  <span
                    className={"kanban-etapa-cor kanban-etapa-cor--" + classeEtapa(etapa)}
                  />
                  <span className="kanban-etapa-nome">{etapa}</span>
                  <span className="kanban-contador">{daColuna.length}</span>
                </header>

                <div className="kanban-cartoes">
                  {daColuna.length === 0 ? (
                    <p className="kanban-vazio">Nenhum contato nesta etapa.</p>
                  ) : (
                    daColuna.map((contato) => (
                      <article
                        key={contato.id}
                        className="kanban-cartao"
                        draggable
                        onClick={() => router.push(`/contatos/${contato.id}`)}
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", String(contato.id));
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setColunaAlvo("")}
                      >
                        <span className="kanban-cartao-nome">{contato.nome}</span>
                        <span className="kanban-cartao-email">
                          {contato.email || "—"}
                        </span>
                        <span className="kanban-cartao-tempo">
                          {tempoDesde(contato.criado_em)}
                        </span>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {modalAberto ? (
        <div
          className="modal-fundo"
          onClick={(e) => {
            if (e.target === e.currentTarget && !salvando) setModalAberto(false);
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-label="Novo contato">
            <h2 className="section-title">Novo contato</h2>

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
                  autoFocus
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className={"input" + (campoComErro === "email" ? " input--erro" : "")}
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
                  className={
                    "input" + (campoComErro === "telefone" ? " input--erro" : "")
                  }
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 91234-5678"
                />
              </div>

              {erroForm ? <p className="erro">{erroForm}</p> : null}

              <div className="modal-acoes">
                <button className="botao" type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : "Salvar contato"}
                </button>
                <button
                  className="botao-texto"
                  type="button"
                  onClick={() => setModalAberto(false)}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
