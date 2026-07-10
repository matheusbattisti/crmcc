-- Tabela de contatos do CRM
create table if not exists contatos (
  id         bigint generated always as identity primary key,
  nome       text not null,
  email      text,
  telefone   text,
  etapa      text not null default 'novo'
             check (etapa in ('novo', 'em contato', 'proposta', 'cliente')),
  anotacoes  text,
  criado_em  timestamptz not null default now()
);

-- 3 contatos de exemplo (a data de cadastro é preenchida sozinha)
insert into contatos (nome, email, telefone, etapa, anotacoes) values
  ('Ana Souza',   'ana.souza@exemplo.com',   '(11) 90000-0001', 'novo',       'Veio pelo site, pediu orçamento.'),
  ('Bruno Lima',  'bruno.lima@exemplo.com',  '(11) 90000-0002', 'em contato', 'Retornar ligação na quinta.'),
  ('Carla Nunes', 'carla.nunes@exemplo.com', '(11) 90000-0003', 'proposta',   'Proposta enviada, aguardando resposta.');
