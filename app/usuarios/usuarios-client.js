"use client";

import { useState } from "react";

export default function UsuariosClient({ usuariosIniciais }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [processandoId, setProcessandoId] = useState(null);
  const [erro, setErro] = useState("");

  async function aprovar(id) {
    setProcessandoId(id);
    setErro("");
    try {
      const resposta = await fetch(`/api/usuarios/${id}`, { method: "PATCH" });
      const dado = await resposta.json();
      if (!resposta.ok) {
        setErro(dado.error || "Não foi possível aprovar.");
        return;
      }
      setUsuarios(usuarios.map((u) => (u.id === id ? dado : u)));
    } catch {
      setErro("Não foi possível aprovar. Verifique sua conexão.");
    } finally {
      setProcessandoId(null);
    }
  }

  const pendentes = usuarios.filter((u) => u.status === "pendente").length;

  return (
    <section className="card">
      <h1 className="section-title">
        Usuários <span className="contagem">{usuarios.length}</span>
      </h1>

      {erro ? <p className="erro">{erro}</p> : null}

      <p className="anotacoes-status">
        {pendentes > 0
          ? `${pendentes} aguardando aprovação.`
          : "Nenhum usuário pendente."}
      </p>

      <ul className="lista">
        {usuarios.map((u) => (
          <li key={u.id} className="lista-item">
            <div className="lista-linha">
              <div className="lista-info">
                <span className="lista-nome">{u.usuario}</span>
                <span className="lista-contato">
                  {u.role === "admin" ? "Administrador" : "Usuário"}
                </span>
              </div>
              <div className="lista-direita">
                <span className={"badge badge--" + u.status}>{u.status}</span>
                {u.status === "pendente" ? (
                  <button
                    type="button"
                    className="botao botao--pequeno"
                    disabled={processandoId === u.id}
                    onClick={() => aprovar(u.id)}
                  >
                    {processandoId === u.id ? "Aprovando..." : "Aprovar"}
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
