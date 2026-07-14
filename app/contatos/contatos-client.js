"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { telefoneValido, emailValido } from "../../lib/validacao";

export default function ContatosClient() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [campoComErro, setCampoComErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState("");

  // Busca por nome ou email — a lista carrega uma vez e o filtro roda na tela.
  const [busca, setBusca] = useState("");
  const [todos, setTodos] = useState(null); // null = ainda carregando
  const [erroBusca, setErroBusca] = useState("");

  useEffect(() => {
    let ativo = true;
    fetch("/api/contatos")
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => {
        if (ativo) setTodos(dados);
      })
      .catch(() => {
        if (ativo) setErroBusca("Não foi possível carregar os contatos para a busca.");
      });
    return () => {
      ativo = false;
    };
  }, []);

  const termo = busca.trim().toLowerCase();
  const resultados =
    termo && todos
      ? todos.filter(
          (c) =>
            c.nome.toLowerCase().includes(termo) ||
            (c.email || "").toLowerCase().includes(termo)
        )
      : [];

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setCampoComErro("");
    setSucesso("");

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

    // Email (se preenchido) precisa ter formato de email.
    if (!emailValido(email)) {
      setErro("Email inválido. Confira o formato, ex.: maria@exemplo.com.");
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
        setErro(dado.error || "Não foi possível salvar. Tente de novo.");
        return;
      }

      // Limpa o formulário e avisa; o contato aparece na área Funil e na busca.
      setNome("");
      setEmail("");
      setTelefone("");
      setSucesso(`Contato "${dado.nome}" salvo. Ele já aparece no Funil.`);
      if (todos) setTodos([dado, ...todos]);
    } catch {
      setErro("Não foi possível salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <section className="card">
        <h1 className="section-title">Buscar contato</h1>
        <input
          className="input"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Nome ou email do contato…"
          aria-label="Buscar contato por nome ou email"
        />

        {erroBusca ? <p className="erro busca-status">{erroBusca}</p> : null}

        {termo && !erroBusca ? (
          todos === null ? (
            <p className="anotacoes-status busca-status">Carregando...</p>
          ) : resultados.length === 0 ? (
            <p className="anotacoes-status busca-status">Nenhum contato encontrado.</p>
          ) : (
            <ul className="busca-lista">
              {resultados.map((c) => (
                <li key={c.id}>
                  <Link className="busca-item" href={`/contatos/${c.id}`}>
                    <span className="lista-nome">{c.nome}</span>
                    <span className="lista-contato">{c.email || "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </section>

      <section className="card">
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
            className={"input" + (campoComErro === "telefone" ? " input--erro" : "")}
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 91234-5678"
          />
        </div>

        {erro ? <p className="erro">{erro}</p> : null}
        {sucesso ? <p className="aviso">{sucesso}</p> : null}

        <button className="botao" type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar contato"}
        </button>
      </form>
      </section>
    </>
  );
}
