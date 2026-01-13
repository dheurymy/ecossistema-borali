# 📱 BORALI Mobile - Apps React Native

[![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg)]()

Aplicativos mobile da plataforma **BORALI** - Turismo gamificado com álbum de figurinhas, cupons de desconto e sistema de pontos.

---

## 📂 Estrutura do Repositório

```
borali-mobile/
├── borali-app/          # 🎮 App do Usuário Final
│   ├── src/
│   ├── assets/
│   └── package.json
│
├── borali-suporte/      # 🛠️ App Administrativo
│   ├── src/
│   ├── assets/
│   └── package.json
│
└── documentacao/        # 📚 Documentação Compartilhada
    ├── borali-suporte.md
    ├── TESTES-CUPONS.md
    └── README.md
```

---

## 🎮 Borali App - Usuário Final

Aplicativo para turistas e moradores locais explorarem a cidade de forma gamificada.

### ✨ Funcionalidades
- 📍 Mapa interativo com pontos de interesse
- 🎫 Cupons de desconto em estabelecimentos parceiros
- 🃏 Álbum de figurinhas colecionáveis
- ⭐ Sistema de pontos e conquistas
- 📊 Ranking de usuários
- 🏆 Missões diárias e semanais
- 🔔 Notificações de ofertas próximas

### 🛠️ Tecnologias
- React Native 0.76.5
- Expo SDK 54
- TypeScript
- React Navigation 6
- Expo Location & Maps
- Axios

### 🚀 Como Executar

```bash
cd borali-app
npm install
npx expo start
```

Escaneie o QR code com **Expo Go** (Android/iOS)

---

## 🛠️ Borali Suporte - App Administrativo

Aplicativo interno para equipe BORALI gerenciar todo o conteúdo da plataforma.

### ✨ Funcionalidades Implementadas

#### Dashboard
- 📊 Métricas principais (negócios, MRR, ARR)
- 📈 Distribuição por status e planos
- 🎯 Top categorias
- 🔄 Refresh automático

#### Gestão de Negócios
- ✅ CRUD completo com validações
- ✅ Aprovação/rejeição de cadastros
- ✅ Upload de logo (1MB)
- ✅ Busca e filtros avançados
- ✅ Gestão de assinaturas
- ✅ Estatísticas (MRR, ARR)

#### Gestão de Pontos de Interesse
- ✅ CRUD completo
- ✅ Upload de múltiplas fotos
- ✅ Mapa interativo
- ✅ Busca por proximidade
- ✅ Filtros por categoria/status

#### Sistema de Cupons (Sprint 2 ✅)
- ✅ CRUD completo (426 linhas controller)
- ✅ Aprovação/rejeição com modal
- ✅ Pausar/ativar cupons
- ✅ Filtros (Ativos, Pausados, Expirados)
- ✅ Busca otimizada
- ✅ Estatísticas e tracking
- ✅ Deployed em produção

### 🛠️ Tecnologias
- React Native 0.76.5
- Expo SDK 54
- TypeScript
- React Navigation 6 (Stack, Tabs, Drawer)
- React Native Maps
- Expo Image Picker & Location
- Axios + Interceptors
- AsyncStorage

### 🚀 Como Executar

```bash
cd borali-suporte
npm install
npx expo start
```

**Credenciais de Teste:**
- Email: `admin@borali.com`
- Senha: `admin123`

---

## 🔗 Backend (API)

Os apps se conectam à API REST hospedada em Vercel:

**URL:** `https://borali-api.vercel.app`

**Repositório:** [borali-api](https://github.com/dheurymy/borali-api)

### Endpoints Principais
- `/usuarios` - Autenticação
- `/negocios` - CRUD de negócios parceiros
- `/pontos` - CRUD de pontos de interesse
- `/cupons` - Sistema de cupons e ofertas
- `/administradores` - Gestão de admins

---

## 📚 Documentação Detalhada

### Guias Disponíveis
- **[Borali Suporte](./documentacao/borali-suporte.md)** - Funcionalidades completas do app admin
- **[Testes de Cupons](./documentacao/TESTES-CUPONS.md)** - Guia completo de testes do sistema de cupons
- **[Visão do Produto](./documentacao/BORALI-VISAO-PRODUTO.md)** - Visão geral da plataforma

### Stack Técnico
```
Frontend:  React Native + Expo + TypeScript
Backend:   Node.js + Express + MongoDB
Deploy:    Vercel (API) + Expo Go (Apps)
Maps:      Google Maps + Expo Location
Storage:   AsyncStorage (local) + MongoDB Atlas (remoto)
Auth:      JWT + AsyncStorage
```

---

## 🗓️ Roadmap

### ✅ Sprint 1 (Semanas 1-2) - Concluído
- Autenticação e segurança
- Dashboard administrativo
- CRUD de negócios e pontos
- Mapa interativo

### ✅ Sprint 2 (Semanas 3-4) - Concluído
- **Sistema de Cupons completo**
- Aprovação/rejeição
- Filtros e busca
- Modal customizado
- Deploy em produção

### 🚧 Sprint 3 (Semanas 5-6) - Em Planejamento
- Gestão de usuários finais
- Upload de imagens (Cloudinary/S3)
- Analytics avançado

### 📋 Sprint 4 (Semanas 7-8) - Planejado
- Sistema de gamificação
- Álbum de figurinhas
- Conquistas e missões

### 🔮 Sprint 5 (Semanas 9-10) - Planejado
- Notificações push
- Relatórios exportáveis
- Sistema de suporte

---

## 🐛 Issues Conhecidos

### Corrigidos ✅
- ✅ Erro "next is not a function" (middlewares Mongoose)
- ✅ Botão rejeitar cupom não funciona (Alert.prompt)
- ✅ Botões sobrepostos após aprovação (layout)
- ✅ Barra de busca inconsistente

### Em Análise
- Compressão automática de imagens grandes
- Cache de listagens longas

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrão de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição de testes
chore: atualização de build, configs, etc
```

---

## 📄 Licença

Este projeto é privado e confidencial. Todos os direitos reservados © 2026 BORALI.

---

## 👥 Equipe

**Desenvolvimento:** Equipe BORALI Tech  
**Data de Início:** Janeiro 2026  
**Status Atual:** Sprint 2 Concluída (Sistema de Cupons)  

---

## 📞 Suporte

Para dúvidas ou suporte, consulte a documentação em `/documentacao` ou entre em contato com a equipe de desenvolvimento.

**Última Atualização:** 09/01/2026  
**Versão:** 0.4.0-alpha
