# Preparação do Ambiente de Desenvolvimento

```sh
npm install -g npm@latest
npm install -g pnpm@latest
npm -g i @localazy/cli
```

```sh
- Instalar VS Code
- Instalar extesões sugeridas .vscode/extensions
```

# CI Scripts:

```sh
npm install -g npm@latest
npm install -g pnpm@latest
pnpm i --frozen-lockfile
pnpm test-ci
pnpm build
```

# Localazy - Internacionalização

### Instalar CLI primeiro.

```sh
npm -g i @localazy/cli
```

[Localazy Cli Docs](https://localazy.com/docs/cli/the-basics)

### Crie as traduções no localazy e faça o Download

```sh
pnpm localazy-downloads
```

### Após do download do localazy rode o teste

```sh
pnpm build-locales
```

# Comandos úteis

### Deletar node modules rapidamente

```sh
pnpm clean-and-install
```

# SVGs

Utilize o link que aparece na barra header em SvgGallery.

#### Para criar um novo SVG procure em:

https://lucide.dev/icons/<br/>
https://tabler.io/icons<br/>
https://www.svgrepo.com/

Dê preferencia para svgs com padrão de viewBox: `0 0 24 24`.

#### Novo Svg no sistema:

Use um Svg pronto e utilize Salvar Como.

Altere `Stroke/Fill={color}` conforme o SVG.

Copie e cole apenas tags de desenho do SVG como Path/Rectangle/etc...

Após salvar rode o comando:

```sh
pnpm build-svg-gallery
```

Após rodar o comando o svg estará no SvgGallery.

# Auditoria de dependências

```sh
pnpm audit -P
```

Para tentar corrigir automaticamente vulnerabilidades:

```sh
pnpm audit --fix
```

## Dicas para erros do oxlint

##### typescript-eslint(no-floating-promises): Promises must be awaited, add void operator to ignore ::: Para promisses dentro de useEffect ou outros lugares que nao houver async, por exemplo "refetch()" "methods.Trigger()", use "void" antes da funcao, mas se possível utilize async await.
