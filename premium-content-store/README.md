# Premium Content Store

> Projeto estático com landing page para conteúdo premium.

Sumário rápido:

- HTML: `index.html`
- CSS: `css/styles.css`
- JS: `js/main.js`
- Imagens: `images/`

Como preparar e enviar para o GitHub (resumo):

1. Inicializar repositório local (já faço isso automaticamente se você confirmar).

2. Criar repositório remoto no GitHub (duas opções):
   - Usando GitHub Web: crie um repositório novo no https://github.com/new e copie a URL.
   - Usando GitHub CLI (se instalado):
     gh repo create <nome-do-repo> --public --source=. --remote=origin --push

3. Adicionar remote e enviar:

```powershell
# dentro da pasta do projeto
git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git
git branch -M main
git push -u origin main
```

Notas importantes:
- Configure seu nome/email do git globalmente antes de commitar, por exemplo:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu@exemplo.com"
```

- Remova qualquer conteúdo sensível (ex.: arquivos `.env`) antes de subir.

Se quiser, eu já inicializo o git local e faço o commit inicial agora. Depois posso te mostrar os comandos para criar o repo remoto e dar o push (ou posso criar remoto via GitHub CLI, se você autorizar e tiver o `gh` instalado e autenticado).
