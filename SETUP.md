# 🔧 Guia de Configuração - Campeonato FIFA 24 Albatroz

Este guia irá te ajudar a configurar e fazer o deploy do sistema de campeonatos FIFA 24 no GitHub Pages com Firebase.

## 📋 Checklist de Configuração

- [ ] Conta no GitHub
- [ ] Conta no Firebase (Google)
- [ ] Node.js instalado
- [ ] Git configurado

## 🚀 Passo a Passo Completo

### ⚡ Execução rápida no localhost

Se você só quer validar se o projeto está funcionando localmente, execute:

```bash
pnpm install
pnpm run dev -- --host 0.0.0.0 --port 5173
```

Depois, abra no navegador:

`http://localhost:5173`

Para parar o servidor, pressione `Ctrl + C` no terminal.

### 1. Preparação do Ambiente

#### 1.1 Verificar Node.js
```bash
node --version
# Deve retornar v18.0.0 ou superior
```

Se não tiver o Node.js instalado:
- Acesse [nodejs.org](https://nodejs.org/)
- Baixe e instale a versão LTS

#### 1.2 Instalar pnpm (Recomendado)
```bash
npm install -g pnpm
```

### 2. Configuração do Firebase

#### 2.1 Criar Projeto no Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Nome do projeto: `albatroz-fifa-championship` (ou outro nome)
4. Desabilite o Google Analytics (opcional)
5. Clique em "Criar projeto"

#### 2.2 Configurar Authentication
1. No menu lateral, clique em "Authentication"
2. Clique em "Vamos começar"
3. Vá na aba "Sign-in method"
4. Ative "Email/password":
   - Clique em "Email/password"
   - Ative a primeira opção
   - Clique em "Salvar"
5. Ative "Google":
   - Clique em "Google"
   - Ative o provedor
   - Adicione seu email como email de suporte do projeto
   - Clique em "Salvar"

#### 2.3 Configurar Firestore Database
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Selecione uma localização (ex: southamerica-east1)
5. Clique em "Concluído"

#### 2.4 Configurar Regras do Firestore
1. Vá na aba "Regras"
2. Substitua o conteúdo por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Clique em "Publicar"

#### 2.5 Obter Configurações do Firebase
1. Clique no ícone de engrenagem > "Configurações do projeto"
2. Role até "Seus apps"
3. Clique no ícone "</>" (Web)
4. Nome do app: "Albatroz FIFA Championship"
5. Marque "Configurar também o Firebase Hosting"
6. Clique em "Registrar app"
7. **COPIE** o objeto `firebaseConfig` que aparece

### 3. Configuração do Projeto

#### 3.1 Fork do Repositório
1. Acesse [github.com/pereirapedrohs/albatroz-fifa-championship](https://github.com/pereirapedrohs/albatroz-fifa-championship)
2. Clique em "Fork" no canto superior direito
3. Escolha sua conta como destino

#### 3.2 Clone do Projeto
```bash
git clone https://github.com/SEU-USUARIO/albatroz-fifa-championship.git
cd albatroz-fifa-championship
```

#### 3.3 Instalar Dependências
```bash
pnpm install
```

#### 3.4 Configurar Firebase no Projeto
1. Abra o arquivo `src/lib/firebase.js`
2. Substitua o objeto `firebaseConfig` pelo que você copiou do Firebase:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Sua API Key
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

#### 3.5 Testar Localmente
```bash
pnpm run dev
```
Acesse `http://localhost:5173` e teste o login

### 4. Configuração do GitHub Pages

#### 4.1 Configurar Base URL
1. Abra `vite.config.js`
2. Altere a linha `base: '/albatroz-fifa-championship/',` para:
```javascript
base: '/SEU-REPOSITORIO-NAME/',
```

#### 4.2 Ativar GitHub Pages
1. Vá no seu repositório no GitHub
2. Clique em "Settings"
3. Role até "Pages" no menu lateral
4. Em "Source", selecione "Deploy from a branch"
5. Em "Branch", selecione "gh-pages"
6. Clique em "Save"

#### 4.3 Fazer Deploy
```bash
git add .
git commit -m "Configuração inicial do Firebase"
git push origin main
```

O GitHub Actions irá automaticamente fazer o build e deploy.

### 5. Configurações Adicionais do Firebase

#### 5.1 Adicionar Domínio Autorizado
1. Volte ao Firebase Console
2. Authentication > Settings > Authorized domains
3. Adicione: `seu-usuario.github.io`

#### 5.2 Configurar Hosting (Opcional)
Se quiser usar o Firebase Hosting em vez do GitHub Pages:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Escolha o projeto criado
# Public directory: dist
# Single-page app: Yes
# Overwrite index.html: No
```

## 🔍 Verificação da Configuração

### Checklist Final
- [ ] Firebase projeto criado
- [ ] Authentication configurado (Email + Google)
- [ ] Firestore configurado com regras
- [ ] Configurações do Firebase no código
- [ ] GitHub Pages ativado
- [ ] Deploy realizado com sucesso
- [ ] Site acessível via GitHub Pages
- [ ] Login funcionando
- [ ] Cadastro de jogador funcionando

### URLs Importantes
- **Seu site**: `https://seu-usuario.github.io/albatroz-fifa-championship/`
- **Firebase Console**: `https://console.firebase.google.com/project/seu-projeto-id`
- **GitHub Actions**: `https://github.com/seu-usuario/albatroz-fifa-championship/actions`

## 🐛 Problemas Comuns

### Erro: "Firebase configuration not found"
**Solução**: Verifique se copiou corretamente as configurações do Firebase para `src/lib/firebase.js`

### Erro: "Unauthorized domain"
**Solução**: Adicione seu domínio GitHub Pages nos domínios autorizados do Firebase Auth

### Site não carrega após deploy
**Solução**: 
1. Verifique se o `base` no `vite.config.js` está correto
2. Aguarde alguns minutos para propagação
3. Verifique se o GitHub Actions executou sem erros

### Erro de permissão no Firestore
**Solução**: Verifique se as regras do Firestore estão configuradas corretamente

### Build falha no GitHub Actions
**Solução**: 
1. Verifique se não há erros de sintaxe no código
2. Confirme se todas as dependências estão no `package.json`

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs**:
   - GitHub Actions: Aba "Actions" do repositório
   - Firebase: Console do Firebase > Authentication/Firestore

2. **Recursos úteis**:
   - [Documentação do Firebase](https://firebase.google.com/docs)
   - [Documentação do GitHub Pages](https://docs.github.com/pages)
   - [Documentação do Vite](https://vitejs.dev/)

3. **Comunidade**:
   - Stack Overflow
   - Discord do React
   - Fórum do Firebase

---

**Boa sorte com seu campeonato! 🏆**
