# CV Wizard App

Ferramenta web para criação de currículos com múltiplos modelos, edição visual e exportação para PDF.

## Rodar localmente (desenvolvimento)

1. Abra o terminal na pasta do projeto.
2. Instale dependências:

```bash
npm install
```

3. Execute em modo dev:

```bash
npm run dev
```

4. Abra no navegador:

```text
http://localhost:5173/
```

## Gerar versão para compartilhar

1. Gere o build:

```bash
npm run build
```

2. A pasta `dist` será criada.
3. Envie a pasta `dist` para outra pessoa.
4. Essa pessoa pode abrir o arquivo `dist/index.html` no navegador.

Observação: o projeto foi configurado com `base: './'`, então os assets do build usam caminhos relativos e funcionam offline.

## Visualizar build localmente (opcional)

```bash
npm run preview
```
