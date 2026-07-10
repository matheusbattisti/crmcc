-- Tabela de usuários do sistema (login, papéis e aprovação)
create table if not exists usuarios (
  id         bigint generated always as identity primary key,
  usuario    text not null unique,
  senha_hash text not null,
  role       text not null default 'user'     check (role in ('admin', 'user')),
  status     text not null default 'pendente' check (status in ('pendente', 'aprovado')),
  criado_em  timestamptz not null default now()
);
