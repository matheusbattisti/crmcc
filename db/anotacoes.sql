-- Tabela de anotações (histórico por contato)
create table if not exists anotacoes (
  id         bigint generated always as identity primary key,
  contato_id bigint not null references contatos(id) on delete cascade,
  texto      text not null,
  criado_em  timestamptz not null default now()
);

-- Índice para buscar rápido as anotações de um contato
create index if not exists anotacoes_contato_id_idx on anotacoes (contato_id);
