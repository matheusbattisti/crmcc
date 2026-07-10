"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(evento) {
    evento.preventDefault();
    setErro("");
    setEntrando(true);
    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      if (!resposta.ok) {
        const dado = await resposta.json();
        setErro(dado.error || "Não foi possível entrar.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErro("Não foi possível entrar. Verifique sua conexão.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="brand login-brand">
          <span className="brand-mark" />
          <span className="brand-name">Meu CRM</span>
        </div>

        <h1 className="section-title">Entrar</h1>

        <form onSubmit={entrar} noValidate>
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
              autoComplete="current-password"
            />
          </div>

          {erro ? <p className="erro">{erro}</p> : null}

          <button className="botao" type="submit" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link href="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
