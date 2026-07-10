"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  async function cadastrar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const resposta = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });
      const dado = await resposta.json();

      if (!resposta.ok) {
        setErro(dado.error || "Não foi possível cadastrar.");
        return;
      }

      setPronto(true);
    } catch {
      setErro("Não foi possível cadastrar. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="brand login-brand">
          <span className="brand-mark" />
          <span className="brand-name">Meu CRM</span>
        </div>

        {pronto ? (
          <>
            <h1 className="section-title">Cadastro enviado</h1>
            <p className="anotacoes-status">
              Sua conta foi criada e está <strong>pendente de aprovação</strong>.
              Assim que o administrador aprovar, você poderá entrar.
            </p>
            <p className="auth-link">
              <Link href="/login">Ir para o login</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="section-title">Criar conta</h1>
            <form onSubmit={cadastrar} noValidate>
              <div className="field">
                <label className="label" htmlFor="usuario">Usuário</label>
                <input
                  id="usuario"
                  className="input"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  className="input"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {erro ? <p className="erro">{erro}</p> : null}

              <button className="botao" type="submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Cadastrar"}
              </button>
            </form>

            <p className="auth-link">
              Já tem conta? <Link href="/login">Entrar</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
