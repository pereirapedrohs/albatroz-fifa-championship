# Campeonato FIFA 24 - Grupo Albatroz

Sistema completo para gerenciamento de campeonatos de FIFA 24, desenvolvido especificamente para o grupo Albatroz. O sistema permite criar campeonatos no formato liga ou copa, gerenciar jogadores, times, sorteios, tabelas e resultados.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Login com email e senha
- Autenticação via Google
- Registro de novos usuários
- Gerenciamento de sessão

### ✅ Cadastro de Jogadores
- Cadastro completo de jogadores
- Seleção de times de futebol (FIFA 24)
- Organização por ligas (Premier League, La Liga, Serie A, etc.)
- Validação de times únicos por campeonato

### ✅ Gerenciamento de Campeonatos
- Criação de campeonatos tipo **Liga** (pontos corridos)
- Criação de campeonatos tipo **Copa** (eliminatória)
- Configuração de número máximo de participantes (4, 8, 16, 32)
- Status de campeonatos (Criado, Em Andamento, Finalizado)

### ✅ Sistema de Sorteios e Tabelas
- Sorteio automático de jogos para liga (todos contra todos)
- Geração automática de chaves para copa
- Tabela de classificação em tempo real (liga)
- Visualização de chaves eliminatórias (copa)

### ✅ Cadastro de Resultados
- Interface intuitiva para registrar placares
- Atualização automática das tabelas
- Histórico completo de jogos
- Validação de resultados

### ✅ Sistema de Regras
- Regras padrão pré-configuradas
- Criação de regras customizadas
- Configuração específica por campeonato
- Categorias: Jogo, Times, Copa, Comportamento

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Autenticação**: Firebase Auth
- **Banco de Dados**: Firebase Firestore
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Deploy**: GitHub Pages

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js (versão 18 ou superior)
- npm ou pnpm
- Git
- Conta no Firebase (para configuração do backend)

## 🔧 Configuração do Projeto

### 1. Clone o Repositório

```bash
git clone https://github.com/pereirapedrohs/albatroz-fifa-championship.git
cd albatroz-fifa-championship
```

### 2. Instale as Dependências

```bash
# Usando npm
npm install

# Ou usando pnpm (recomendado)
pnpm install
```

### 3. Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative os seguintes serviços:
   - **Authentication** (Email/Password e Google)
   - **Firestore Database**

4. Obtenha as credenciais do projeto:
   - Vá em Configurações do Projeto > Geral
   - Role até "Seus apps" e clique em "Configuração"
   - Copie o objeto `firebaseConfig`

5. Substitua as configurações no arquivo `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-sender-id",
  appId: "seu-app-id"
};
```

### 4. Configuração do Firestore

Configure as regras de segurança do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Configuração da Autenticação

No Console do Firebase:
1. Vá em Authentication > Sign-in method
2. Ative "Email/password"
3. Ative "Google" e configure o domínio autorizado

## 🚀 Executando o Projeto

### Desenvolvimento Local

```bash
# Usando npm
npm run dev

# Ou usando pnpm
pnpm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Usando npm
npm run build

# Ou usando pnpm
pnpm run build
```

## 📦 Deploy no GitHub Pages

### Configuração Automática

O projeto já está configurado para deploy automático no GitHub Pages através do GitHub Actions.

### Passos para Deploy:

1. **Fork ou Clone** este repositório para sua conta do GitHub

2. **Configure o Firebase** conforme as instruções acima

3. **Ative o GitHub Pages**:
   - Vá em Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"

4. **Push para a branch main**:
   ```bash
   git add .
   git commit -m "Configuração inicial"
   git push origin main
   ```

5. **Aguarde o Deploy**: O GitHub Actions irá automaticamente fazer o build e deploy

### URL do Site

Após o deploy, seu site estará disponível em:
```
https://seu-usuario.github.io/albatroz-fifa-championship/
```

## 📱 Como Usar o Sistema

### 1. Primeiro Acesso
1. Acesse o site
2. Crie uma conta ou faça login
3. Complete seu cadastro de jogador
4. Escolha seu time de futebol

### 2. Criando um Campeonato
1. Vá em "Campeonatos"
2. Clique em "Criar Campeonato"
3. Escolha o tipo (Liga ou Copa)
4. Configure o número máximo de jogadores
5. Adicione uma descrição (opcional)

### 3. Participando de Campeonatos
1. Navegue pelos campeonatos disponíveis
2. Clique em "Participar" nos campeonatos desejados
3. Aguarde outros jogadores se inscreverem
4. O criador do campeonato pode iniciar quando houver jogadores suficientes

### 4. Registrando Resultados
1. Acesse o campeonato em andamento
2. Clique no jogo que você participou
3. Registre o placar
4. A tabela será atualizada automaticamente

### 5. Configurando Regras
1. Vá em "Regras"
2. Visualize as regras padrão
3. Crie regras customizadas se necessário
4. Configure regras específicas para seus campeonatos

## 🎮 Times Disponíveis

O sistema inclui times das principais ligas:

- **Premier League**: Arsenal, Chelsea, Liverpool, Manchester City, etc.
- **La Liga**: Real Madrid, Barcelona, Atlético Madrid, etc.
- **Serie A**: Juventus, AC Milan, Inter Milan, Napoli, etc.
- **Bundesliga**: Bayern Munich, Borussia Dortmund, etc.
- **Ligue 1**: PSG, Marseille, Lyon, etc.
- **Brasileirão**: Flamengo, Palmeiras, Corinthians, etc.
- **Seleções**: Brasil, Argentina, França, Alemanha, etc.

## 🔧 Estrutura do Projeto

```
albatroz-fifa-championship/
├── public/
│   ├── _redirects          # Configuração para SPA
│   └── favicon.ico
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes shadcn/ui
│   │   └── Navbar.jsx     # Barra de navegação
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.jsx
│   ├── data/              # Dados estáticos
│   │   ├── teams.js       # Lista de times
│   │   └── defaultRules.js # Regras padrão
│   ├── lib/               # Configurações e utilitários
│   │   └── firebase.js    # Configuração Firebase
│   ├── pages/             # Páginas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── PlayerRegistration.jsx
│   │   ├── ChampionshipManager.jsx
│   │   ├── ChampionshipView.jsx
│   │   ├── MatchResult.jsx
│   │   └── RulesManager.jsx
│   ├── utils/             # Funções utilitárias
│   │   └── championshipUtils.js
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Ponto de entrada
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions
├── package.json
├── vite.config.js         # Configuração Vite
└── README.md
```

## 🐛 Solução de Problemas

### Erro de Autenticação
- Verifique se as configurações do Firebase estão corretas
- Confirme se os domínios estão autorizados no Firebase Auth

### Erro de Permissão no Firestore
- Verifique as regras de segurança do Firestore
- Confirme se o usuário está autenticado

### Erro no Deploy
- Verifique se o GitHub Pages está ativado
- Confirme se o workflow do GitHub Actions está funcionando

### Site não Carrega Após Deploy
- Verifique se a configuração `base` no `vite.config.js` está correta
- Confirme se o arquivo `_redirects` está presente

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Pedro Pereira** - *Desenvolvimento inicial* - [pereirapedrohs](https://github.com/pereirapedrohs)

## 🙏 Agradecimentos

- Grupo Albatroz pela inspiração
- Comunidade React e Firebase
- Contribuidores do shadcn/ui

---

**Desenvolvido com ❤️ para o Grupo Albatroz**

