# PRD — CRM

## O que é e pra quem

O CRM é um sistema simples para organizar contatos e oportunidades de negócio em um só lugar. Ele é feito para profissionais autônomos e pequenos negócios que hoje controlam seus clientes na cabeça, no caderno ou em planilhas soltas. O objetivo é enxergar com clareza em que ponto cada negócio está e o que precisa ser feito a seguir.

## Funcionalidades da primeira versão (v1)

Lista de itens a concluir:

- [x] Cadastro e listagem de contatos
- [x] Funil com etapas: novo, em contato, proposta, cliente
- [x] Anotações por contato
- [x] Login de administrador
- [x] Follow-up gerado por IA
- [x] Painel com os números do funil
- [x] Publicação na internet
- [x] Multiusuário com aprovação (construído depois, fora do plano original): novos usuários se cadastram, o admin aprova na tela Usuários, e cada um entra com papel de admin ou usuário

## O que NÃO entra na primeira versão

Para não nos perdermos, estes itens ficam de fora por enquanto:

- Integração automática com e-mail, WhatsApp ou telefone
- Importar e exportar contatos em massa (planilhas/CSV)
- Aplicativo mobile nativo (será um site que também abre no celular)
- Campos personalizados no cadastro de contato
- Relatórios avançados e exportação de dados
- Automações e lembretes agendados

## Versão 2 (v2)

Lista de itens a concluir:

- [x] **Kanban do funil** — ver e mover os contatos entre as etapas arrastando.

  PRONTO QUANDO (testável no navegador):
  - Abro o Funil e vejo uma coluna por etapa (novo, em contato, proposta,
    cliente), cada uma com seus contatos e um contador de quantos tem.
  - Arrasto um cartão de uma coluna para outra e a etapa do contato muda.
  - Recarrego a página e o contato continua na coluna nova (salvou de verdade).
  - Volto ao Dashboard e os números refletem a mudança.
  - Se a mudança falhar (ex.: sem conexão), o cartão volta para a coluna
    original e aparece um aviso de erro.

- [x] **Página do contato** — tudo de um contato num lugar só (dados, etapa,
  anotações, follow-ups gerados), com uma busca pra chegar nela rápido.

  PRONTO QUANDO (testável no navegador):
  - Clico em um contato no funil e abro uma página só dele, com nome, email,
    telefone e a etapa atual.
  - Mudo a etapa na página do contato e a mudança aparece no funil e no
    Dashboard.
  - Crio, edito e excluo anotações direto na página do contato.
  - Gero um follow-up na página e ele fica registrado ali, junto com os
    anteriores.
  - Digito o nome de um contato na busca e chego na página dele em poucos
    cliques.

- [x] **Dashboard v2** — os números do funil apresentados como painel de
  sistema, com um gráfico simples da distribuição por etapa.

  PRONTO QUANDO (testável no navegador):
  - Abro o Dashboard e vejo o total e os números por etapa como um painel de
    sistema, na identidade visual do produto.
  - Vejo um gráfico simples da distribuição dos contatos por etapa, usando as
    cores das etapas do design.md.
  - Mudo um contato de etapa (no kanban) e, ao voltar, números e gráfico
    refletem a mudança.
  - Sem nenhum contato cadastrado, o Dashboard mostra um estado vazio legível,
    sem quebrar.
  - Em uma tela estreita (celular), painel e gráfico continuam legíveis.

## Fora da v2 (fica pra v3)

- Permissões avançadas (dono por contato, metas por usuário)
- Automações e lembretes agendados
- Integrações com outros sistemas
- Aplicativo de celular
