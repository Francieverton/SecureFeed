# SecureFeed 🔒

Plataforma de inteligência e segurança digital desenvolvida pela **Equipe Gamma** para o processo seletivo da Loopis Empresa Júnior (2026). O projeto reúne um feed de notícias dinâmico sobre cibersegurança, um verificador de links suspeitos (integrado ao Google Safe Browsing) e um glossário interativo de termos técnicos.

## 🚀 Funcionalidades
- **Feed de notícias:** Consome a NewsAPI para exibir as últimas notícias sobre phishing, ransomware, malware e outros temas.
- **Verificador de segurança:** Analisa URLs em busca de ameaças (engenharia social, malware, etc.) utilizando a API do Google Safe Browsing.
- **Glossário:** Explicações claras sobre os principais termos da área de segurança digital.

## 🛠️ Tecnologias
- **Backend:** JavaScript + Node.js + Express + Axios (rotas unificadas para notícias e verificação)
- **Frontend:** HTML5, CSS3 (variáveis, design responsivo) e JavaScript puro
- **APIs externas:** NewsAPI, Google Safe Browsing (chaves protegidas no backend)

## 👥 Equipe
| Membro | Setor | Papel no Projeto | Responsabilidade Principal |
|--------|-------|------------------|----------------------------|
| Cristiano de Carvalho Goncalves | Projetos | Líder Técnico | Desenvolvimento completo — código, APIs, repositório e deploy |
| Francieverton da Silva Oliveira | Projetos | Líder Técnico | Desenvolvimento completo — código, APIs, repositório e deploy |
| Lucas Edgar Ramalho Nogueira | Marketing | Design & Conteúdo | Identidade visual, CSS global e copywriting do site |
| Francisco Bernardo Tomaz de Alencar | Comercial & Gestão de Pessoas | Comercial e Gestão de Pessoas | Contratos, personas, documentação e processos internos |

---
## 📥 Clonando o Repositório

Antes de configurar as APIs, você precisa baixar o projeto para a sua máquina.

1. Abra o terminal onde deseja salvar o projeto.
2. Execute o comando:
```bash
git clone https://github.com/Francieverton/SecureFeed.git
```
3. Entre na pasta do projeto SecureFeed.

---

## ⚙️ Como utilizar e configurar a API de notícias

**Pré-requisito:** É necessário ter o Node instalado na sua máquina.
> Acesse [nodejs.org](https://nodejs.org) e baixe a versão LTS. Durante a instalação, certifique-se de que a opção "Add to PATH" (ou "Adicionar ao PATH") esteja marcada.

### 1️⃣ Criar sua conta e gerar sua chave na NewsAPI
1. Abra o navegador e acesse: 🔗 https://newsapi.org
2. Clique no botão "Get API key" (no canto superior direito).
3. Preencha o formulário de cadastro:
   - **Email:** seu e-mail
   - **Password:** uma senha
   - **Name:** seu nome
4. Aceite os termos e clique em "Sign up".
5. Pronto! A página vai mostrar sua chave de API. Ela será algo como: `0a1b2c3d4e5f6g7h8i9j0klklklooiii`

> 🔴 **Importante:** Copie essa chave agora! Você só verá ela uma vez.
> ⚠️ Guarde bem essa chave. Ela é como uma senha – nunca compartilhe publicamente.

### 2️⃣ Colocar a chave no projeto
1. Abra a pasta do projeto no seu computador.
2. Entre na pasta `backend`.
3. Dentro dela, crie um arquivo chamado `.env` (se não existir).
4. Abra o arquivo `.env` no bloco de notas ou editor de código e cole:
```env
PORT=3000
NEWS_API_KEY=sua_chave_aqui
```
5. Substitua `sua_chave_aqui` pela chave que você copiou da NewsAPI. Exemplo de como deve ficar:
```env
PORT=3000
NEWS_API_KEY=0a1b2c3d4e5f6g7h8i9jp0o0pkk
```
6. Por último, substitua o nome do arquivo chamado `json` dentro pasta backend para `package.json`.

### 3️⃣ Instalar as dependências (se ainda não fez)
No terminal, execute:
```bash
cd backend
npm install
Npm audit fix --force
```
Isso vai baixar tudo que o projeto precisa para rodar.

### 4️⃣ Ligar o servidor
Ainda no terminal (dentro de `backend`), execute:
```bash
node server.js
```
Você vai ver aparecer:
```text
✅ Servidor rodando na porta 3000
📍 Teste: http://localhost:3000/api/teste
📍 Notícias: http://localhost:3000/api/noticias
📍 Site: http://localhost:3000/
```

---

## 🛡️ Mexer e configurar a API de verificação de URL

1. Entre no [Google Cloud Console](https://console.cloud.google.com/welcome/new).
2. Selecione a caixa de pesquisa e crie um projeto novo (recomendamos que chame de **SecureFeed**).
3. Na caixa de pesquisa coloque **APIs e Serviços -> Biblioteca**.
4. Pesquise por **"Safe Browsing API"** e clique em **Ativar**.
5. Vá em **Credenciais** e clique em **Criar Credenciais -> Chave de API**.
6. Role para baixo e aperte em **Criar**.
7. Copie essa chave.
8. Vá na pasta `backend` -> `verificador.js`.
9. Cole a chave API em `APY_KEY_AQUI`.