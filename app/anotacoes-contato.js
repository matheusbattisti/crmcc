"use client";

import { useState } from "react";

// Mostra a data em formato legível, ex.: "7 de julho de 2026 às 14:30".
function formatarData(iso) {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
}

export default function AnotacoesContato({ contatoId }) {
  const [aberto, setAberto] = useState(false);
  const [anotacoes, setAnotacoes] = useState([]);
  const [carregado, setCarregado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [texto, setTexto] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Edição de uma anotação existente.
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [erroItem, setErroItem] = useState("");
  const [processando, setProcessando] = useState(false);

  async function abrirOuFechar() {
    const novoEstado = !aberto;
    setAberto(novoEstado);

    // Carrega as anotações só na primeira vez que abre.
    if (novoEstado && !carregado) {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await fetch(`/api/anotacoes?contato_id=${contatoId}`);
        const dados = await resposta.json();
        if (resposta.ok) {
          setAnotacoes(dados);
          setCarregado(true);
        } else {
          setErro(dados.error || "Não foi possível carregar as anotações.");
        }
      } catch {
        setErro("Não foi possível carregar as anotações.");
      } finally {
        setCarregando(false);
      }
    }
  }

  async function adicionar(evento) {
    evento.preventDefault();
    setErro("");

    if (!texto.trim()) {
      setErro("Escreva algo para salvar a anotação.");
      return;
    }

    setSalvando(true);
    try {
      const resposta = await fetch("/api/anotacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contato_id: contatoId, texto }),
      });
      const dado = await resposta.json();

      if (!resposta.ok) {
        setErro(dado.error || "Não foi possível salvar. Tente de novo.");
        return;
      }

      // Nova anotação aparece no topo do histórico e o campo limpa.
      setAnotacoes([dado, ...anotacoes]);
      setTexto("");
      setCarregado(true);
    } catch {
      setErro("Não foi possível salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(anotacao) {
    setEditandoId(anotacao.id);
    setTextoEditado(anotacao.texto);
    setErroItem("");
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTextoEditado("");
    setErroItem("");
  }

  async function salvarEdicao(id) {
    if (!textoEditado.trim()) {
      setErroItem("A anotação não pode ficar vazia.");
      return;
    }

    setProcessando(true);
    setErroItem("");
    try {
      const resposta = await fetch(`/api/anotacoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoEditado }),
      });
      const dado = await resposta.json();

      if (!resposta.ok) {
        setErroItem(dado.error || "Não foi possível salvar a edição.");
        return;
      }

      // Troca a anotação editada pela versão atualizada, sem sair da página.
      setAnotacoes(anotacoes.map((a) => (a.id === id ? dado : a)));
      cancelarEdicao();
    } catch {
      setErroItem("Não foi possível salvar a edição.");
    } finally {
      setProcessando(false);
    }
  }

  async function excluir(id) {
    const confirmado = window.confirm(
      "Excluir esta anotação? Essa ação não pode ser desfeita."
    );
    if (!confirmado) return;

    setProcessando(true);
    try {
      const resposta = await fetch(`/api/anotacoes/${id}`, { method: "DELETE" });
      if (!resposta.ok) {
        const dado = await resposta.json();
        window.alert(dado.error || "Não foi possível excluir a anotação.");
        return;
      }
      // Some da lista na hora.
      setAnotacoes(anotacoes.filter((a) => a.id !== id));
      if (editandoId === id) cancelarEdicao();
    } catch {
      window.alert("Não foi possível excluir a anotação.");
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="anotacoes">
      <button type="button" className="anotacoes-toggle" onClick={abrirOuFechar}>
        {aberto ? "Ocultar anotações" : "Anotações"}
      </button>

      {aberto && (
        <div className="anotacoes-painel">
          <form onSubmit={adicionar} className="anotacoes-form">
            <textarea
              className="textarea"
              rows={2}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva uma anotação..."
            />
            {erro ? <p className="erro">{erro}</p> : null}
            <button
              type="submit"
              className="botao botao--pequeno"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Adicionar anotação"}
            </button>
          </form>

          {carregando ? (
            <p className="anotacoes-status">Carregando...</p>
          ) : anotacoes.length === 0 ? (
            <p className="anotacoes-status">Nenhuma anotação ainda.</p>
          ) : (
            <ul className="anotacoes-lista">
              {anotacoes.map((anotacao) => (
                <li key={anotacao.id} className="anotacoes-item">
                  {editandoId === anotacao.id ? (
                    <div className="anotacoes-edicao">
                      <textarea
                        className="textarea"
                        rows={2}
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                      />
                      {erroItem ? <p className="erro">{erroItem}</p> : null}
                      <div className="anotacoes-acoes">
                        <button
                          type="button"
                          className="botao botao--pequeno"
                          disabled={processando}
                          onClick={() => salvarEdicao(anotacao.id)}
                        >
                          {processando ? "Salvando..." : "Salvar"}
                        </button>
                        <button
                          type="button"
                          className="botao-texto"
                          onClick={cancelarEdicao}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="anotacoes-texto">{anotacao.texto}</p>
                      <div className="anotacoes-rodape">
                        <span className="anotacoes-data">
                          {formatarData(anotacao.criado_em)}
                        </span>
                        <div className="anotacoes-acoes">
                          <button
                            type="button"
                            className="botao-texto"
                            onClick={() => iniciarEdicao(anotacao)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="botao-texto botao-texto--perigo"
                            disabled={processando}
                            onClick={() => excluir(anotacao.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
