# Zerada OXC — Boilerplate React + Bootstrap 5

Este repositório é um boilerplate para aplicações web em TypeScript com React e Bootstrap 5, construído para produtividade com Vite, ferramentas de qualidade de código e configuração pronta para testes.

Principais tecnologias
- **Linguagem:** TypeScript
- **Framework:** React
- **Bundler:** Vite
- **Estilização:** Bootstrap 5 (+ Sass/LightningCSS)

Requisitos
- Node.js >= 20
- pnpm (recomendado)

Instalação
1. Instale dependências:

```bash
pnpm install
```

2. Iniciar servidor de desenvolvimento:

```bash
pnpm start
```

Scripts úteis (definidos em `package.json`)
- `pnpm start` — inicia o servidor de desenvolvimento (Vite)
- `pnpm build` — checa tipos e gera build de produção (`pnpm run typecheck && vite build`)
- `pnpm test` — roda `oxlint` (com zero warnings) e executa os testes com `vitest`
- `pnpm test-ui` — inicia `vitest` em modo UI (após rodar `oxlint`)
- `pnpm format` — formata o código com `oxfmt`
- `pnpm lint` — roda `oxlint` com checagem tipo-aware
- `pnpm typecheck` — checagem de tipos TypeScript (`tsc -b --noEmit`)
- `pnpm clean-and-install` — remove node_modules/dist, reinstala e inicia (útil em resets)

Qualidade e hooks
- **oxfmt**: formatação automática (script `format`).
- **oxlint**: lint com suporte a checagem tipo-aware (script `lint`, usado também em `test`).
- **husky** + **lint-staged**: hooks de pré-commit e formatação/linters configurados em `package.json`.

Dependências principais
- `react`, `react-dom` (React 19)
- `bootstrap` (Bootstrap 5)

Dependências de desenvolvimento
- `vite`, `typescript`, `vitest`, `@vitejs/plugin-react`, `oxlint`, `oxfmt`, `husky`, `lint-staged`, entre outras.

Configurações importantes
- `engines.node` em `package.json` exige Node.js >= 20.
- Checagens de lint-format estão integradas aos scripts de teste e aos hooks.

Contribuição
- Siga os scripts de lint/format antes de abrir PRs.
- Execute os testes localmente com `pnpm test`.

Referências rápidas
- Arquivo `package.json`: [package.json](package.json)
- Configuração do Vite: [vite.config.ts](vite.config.ts)
- Entrada da aplicação: [src/main.tsx](src/main.tsx)

Se quiser, eu posso:
- Gerar uma versão em inglês do README.
- Criar um `agent.md` detalhado para agentes e mantenedores.

---
Arquivo gerado automaticamente com base em `package.json`.
