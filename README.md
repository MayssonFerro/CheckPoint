# CheckPoint 🚩

## 📖 Sobre o Projeto
**CheckPoint** é um aplicativo móvel desenvolvido para a comunidade gamer. O objetivo principal é criar um espaço onde os usuários possam registrar suas experiências, avaliar jogos que jogaram e compartilhar opiniões com outros jogadores. O app consome dados reais de jogos (como capas e títulos) através da API da RAWG.

## 🚀 Funcionalidades Principais

*   **Autenticação Segura**: Sistema de cadastro e login para proteger as contas dos usuários.
*   **Feed Global**: Uma timeline onde é possível ver as últimas reviews postadas por todos os usuários.
*   **Busca de Jogos**: Pesquise por qualquer jogo existente (integração com RAWG API).
*   **Criar Reviews**: Dê uma nota (0-10) e escreva sua opinião sobre um jogo. O app salva automaticamente a capa e o nome do jogo.
*   **Perfil do Usuário**: Uma área dedicada para ver, editar ou excluir suas próprias avaliações.
*   **Interface Moderna**: Design com tema escuro (Dark Mode), focado na imersão e usabilidade.

## 🛠 Tecnologias Utilizadas

### Mobile (Frontend)
*   **React Native** (com Expo)
*   **React Navigation** (Stack Navigation)
*   **Axios** (Consumo de API)
*   **Expo Google Fonts** (Ubuntu)

### Backend (API)
*   **Node.js** & **Express**
*   **MongoDB Atlas** (Banco de dados na nuvem)
*   **Mongoose** (ODM)
*   **JWT** (JSON Web Token para autenticação)
*   **Bcryptjs** (Criptografia de senhas)

### Integrações
*   **RAWG API**: Fonte de dados para informações e imagens dos jogos.
*   **Render**: Hospedagem da API (Backend).

## 📦 Como Rodar o Projeto Localmente

### Pré-requisitos
*   Node.js instalado.
*   Gerenciador de pacotes (NPM ou Yarn).
*   Dispositivo físico com Expo Go ou Emulador Android/iOS.

### 1. Configuração do Backend
Entre na pasta do servidor e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:
```env
PORT=5000
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta
RAWG_API_KEY=sua_chave_api_rawg
```

Inicie o servidor:
```bash
npm start
```

### 2. Configuração do Mobile
Entre na pasta do aplicativo e instale as dependências:

```bash
cd CheckPoint
npm install
```

Inicie o Expo:
```bash
npx expo start
```
Escaneie o QR Code com o app **Expo Go** no seu celular.

## 🎨 Identidade Visual
O projeto utiliza uma paleta de cores escura com destaque em laranja:
*   **Background**: `#151515`
*   **Primary Color**: `#fa801f`
*   **Font Family**: Ubuntu

---
Desenvolvido por **Maysson Ferro**.
