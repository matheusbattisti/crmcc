# design.md — Identidade visual do CRM (v2 · Dark Tech)

> Fonte da verdade do visual. Vale para **todas as telas** do projeto —
> incluindo login, cadastro e usuários.
> Junto com o `prd.md`, define o produto. Consulte antes de qualquer tarefa de tela.

## Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite.
**Um produto profissional, não um template.**

## Cores

### Base

| Uso | Cor |
|-----|-----|
| Fundo (quase-preto azulado) | `#0D1117` |
| Superfícies (cartões, barras, painéis) | `#151B24` |
| Superfícies elevadas (modais, menus) | `#1B222E` |
| Borda visível | `#262F3D` |
| Texto principal (claro) | `#E6EAF2` |
| Texto de apoio | `#94A0B8` |

### Destaque (UMA só cor de marca)

Usada em ações e elementos ativos. **Nenhuma outra cor de marca.**

| Uso | Cor |
|-----|-----|
| Destaque — azul elétrico | `#4D8DFF` |
| Destaque no hover (mais claro) | `#6BA1FF` |

### Etapas do funil

Versões luminosas, legíveis no escuro. Usadas **só** nas etiquetas de etapa.

| Etapa | Cor |
|-------|-----|
| novo | `#8B99AD` |
| em contato | `#F5A524` |
| proposta | `#A78BFA` |
| cliente | `#34D399` |

### Erros

| Uso | Cor |
|-----|-----|
| Mensagens e estados de erro | `#F87171` |

O contraste deve ser sempre confortável de ler.

## Tipografia

- Fonte: **Manrope** (Google Fonts) em tudo.
- **NÚMEROS, contadores e etiquetas técnicas** em **JetBrains Mono** (Google Fonts) — o toque tech.
- Títulos em peso forte; textos em peso normal.
- Tamanhos generosos e hierarquia clara.

## Formas e espaçamento

- Cantos levemente arredondados: **10px**.
- **Bordas visíveis** em vez de sombras.
- Bastante respiro entre os elementos.

## Shell de aplicação (de página pra sistema)

O CRM é um sistema com áreas, não uma página única.

- **Navegação lateral fixa à esquerda** com as áreas do sistema:
  - Dashboard (painel com os números do funil)
  - Funil (lista de contatos com etapas, anotações e follow-up)
  - Contatos (cadastro de novos contatos)
  - Usuários (visível **só para admin**)
  - A lista deve comportar novas áreas no futuro sem mudar a estrutura.
- **Cabeçalho** com o nome do CRM, quem está logado e o botão Sair.
- A **área de conteúdo** vive à direita; cada área é uma tela cheia.
- O **item ativo** da navegação é destacado com a cor de destaque.
- Em **telas estreitas**, a navegação se recolhe de um jeito simples e usável.
- Telas fora do sistema (login e cadastro) não têm o shell, mas seguem a mesma identidade.

## PROIBIDO

- Gradientes
- Efeito de vidro / desfoque (glass/blur)
- Emojis na interface
- Sombras exageradas
- Animações chamativas

> Se parecer template de IA, está errado.
