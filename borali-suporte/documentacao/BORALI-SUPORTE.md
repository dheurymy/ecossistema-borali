# 📱 BORALI Suporte - App Administrativo

**Status:** ✅ Em desenvolvimento ativo  
**Plataforma:** React Native + Expo SDK 54  
**Público:** Equipe administrativa BORALI  

---

## 🎯 Objetivo

Aplicativo interno para a equipe BORALI gerenciar todo o conteúdo da plataforma: negócios parceiros, pontos de interesse, cupons, usuários e configurações de gamificação.

---

## ✅ Funcionalidades Implementadas

### 1. Autenticação e Segurança
- ✅ Login com email/senha
- ✅ Cadastro de novos administradores
- ✅ Recuperação de senha (código por email)
- ✅ Reset de senha
- ✅ Token JWT com refresh automático
- ✅ Interceptor de erro 401
- ✅ Logout seguro

**Arquivos:**
- `src/screens/LoginScreen.tsx`
- `src/screens/RegisterScreen.tsx`
- `src/screens/ForgotPasswordScreen.tsx`
- `src/screens/ResetPasswordScreen.tsx`
- `src/services/authService.ts`

---

### 2. Dashboard
- ✅ Visão geral de métricas principais
- ✅ Estatísticas de negócios (total, MRR, ARR)
- ✅ Distribuição por status de assinatura
- ✅ Distribuição por planos
- ✅ Top categorias de negócios
- ✅ Estatísticas de pontos de interesse
- ✅ Refresh manual e automático
- ✅ Cards coloridos com navegação

**Métricas Exibidas:**
- **Negócios:** Total, MRR, ARR, Trial
- **Status:** Ativo, Trial, Inadimplente, Cancelado, Pausado
- **Planos:** Básico, Plus, Premium
- **Pontos:** Total, Ativos, Inativos, Rascunhos

**Arquivo:**
- `src/screens/DashboardScreen.tsx`

---

### 3. Gestão de Negócios Parceiros

#### Lista de Negócios
- ✅ Listagem com paginação (20 por página)
- ✅ Busca por nome (real-time)
- ✅ Filtros rápidos (Ativos, Trial, Inadimplente)
- ✅ Filtros por categoria
- ✅ Cards com logo, nome, categoria, localização
- ✅ Badges de status (assinatura + cadastro)
- ✅ Estatísticas (visualizações, cupons, avaliação)
- ✅ Aprovação/rejeição de cadastros pendentes
- ✅ Exclusão com confirmação
- ✅ Pull-to-refresh
- ✅ Infinite scroll

**Arquivo:**
- `src/screens/NegociosListScreen.tsx`

#### Formulário de Negócio
- ✅ Modo criação + edição
- ✅ Upload de logo (validação 1MB)
- ✅ Dados básicos (nome, categoria, descrição)
- ✅ Localização completa (endereço, coordenadas)
- ✅ Contatos (telefone, WhatsApp, email, site, redes sociais)
- ✅ Horários de funcionamento
- ✅ Seleção de plano (Básico/Plus/Premium)
- ✅ Validação de campos obrigatórios
- ✅ Validação de coordenadas geográficas
- ✅ Validação de email
- ✅ Loading states
- ✅ Feedback ao usuário

**Categorias Disponíveis:**
- Restaurante, Hotel, Pousada, Guia Turístico, Agência de Turismo, Transporte, Artesanato, Loja, Serviços, Entretenimento, Outro

**Arquivo:**
- `src/screens/NegocioFormScreen.tsx`

---

### 4. Gestão de Pontos de Interesse

#### Lista de Pontos
- ✅ Listagem com paginação
- ✅ Busca por nome
- ✅ Filtros por categoria e status
- ✅ Cards com foto, nome, categoria, localização
- ✅ Estatísticas (visualizações, avaliação)
- ✅ Badge de status (ativo/inativo/rascunho)
- ✅ Edição e exclusão
- ✅ Pull-to-refresh
- ✅ Botão FAB para criar novo

**Arquivo:**
- `src/screens/PontosListScreen.tsx`

#### Formulário de Ponto
- ✅ Modo criação + edição
- ✅ Upload de múltiplas fotos
- ✅ Foto de capa
- ✅ Dados completos (nome, descrições, categoria)
- ✅ Localização com coordenadas
- ✅ Informações práticas (horários, preços, tempo visita)
- ✅ Contatos e acessibilidade
- ✅ Status (ativo/inativo/rascunho)

**Arquivo:**
- `src/screens/PontoFormScreen.tsx`

---

### 5. Mapa de Pontos
- ✅ Visualização em Google Maps
- ✅ Marcadores customizados
- ✅ Busca de pontos próximos (raio 50km)
- ✅ Auto-zoom baseado nos pontos
- ✅ Card de informações com foto
- ✅ Navegação para edição
- ✅ Localização do usuário

**Arquivo:**
- `src/screens/MapScreen.tsx`

---

### 6. Sistema de Cupons/Ofertas

#### Lista de Cupons
- ✅ Listagem com paginação (20 por página)
- ✅ Busca por código/título (com botão e Enter)
- ✅ Filtros rápidos (Ativos, Pausados, Expirados)
- ✅ Cards com ícone de tipo, título, código, negócio
- ✅ Badges de status (statusCupom + statusAprovacao)
- ✅ Estatísticas (visualizações, cliques, resgates/limite)
- ✅ Aprovação/rejeição de cupons pendentes
- ✅ Modal customizado para capturar motivo de rejeição
- ✅ Pausar/ativar cupons aprovados
- ✅ Exclusão com confirmação (aprovados e rejeitados)
- ✅ Pull-to-refresh
- ✅ Infinite scroll

**Arquivo:**
- `src/screens/CuponsListScreen.tsx` (785 linhas)

#### Formulário de Cupom
- ✅ Modo criação + edição
- ✅ Dados básicos (título, descrição, código)
- ✅ Seleção de negócio (picker com negócios aprovados)
- ✅ Tipo de cupom (Percentual, Valor Fixo, Brinde, Outro)
- ✅ Campos condicionais por tipo
- ✅ Datas de validade (início/fim)
- ✅ Limite de resgates (ilimitado ou com limite)
- ✅ Regras e restrições
- ✅ Código auto-gerado com refresh
- ✅ Validações completas
- ✅ Loading states

**Arquivo:**
- `src/screens/CupomFormScreen.tsx` (500+ linhas)

#### Service e Navegação
- ✅ TypeScript service completo (160 linhas)
- ✅ Stack navigator integrado
- ✅ Tab com ícone pricetag
- ✅ Backend deployed em Vercel

**Arquivos:**
- `src/services/cuponsService.ts`
- `src/navigation/CuponsStackNavigator.tsx`

**Status:** ✅ **100% Funcional e Testado**

---

### 6. Gestão de Usuários ✅

#### Lista de Usuários
- ✅ Listagem com paginação (20 por página)
- ✅ Busca por nome ou email
- ✅ Filtros rápidos (Ativos, Banidos)
- ✅ Cards com avatar, nome, email, localização
- ✅ Badges de status (Ativo/Banido/Inativo)
- ✅ Estatísticas inline (nível, pontos, check-ins, cupons)
- ✅ Ações: Banir, Desbanir, Excluir
- ✅ Confirmação com motivo para banimento
- ✅ Pull-to-refresh
- ✅ Infinite scroll

**Arquivo:**
- `src/screens/UsersListScreen.tsx` (650+ linhas)

#### Detalhes do Usuário
- ✅ Avatar grande com placeholder
- ✅ Informações pessoais (nome, email, localização, idade)
- ✅ Status visual (badge colorido)
- ✅ Informações de banimento (motivo + data)
- ✅ Estatísticas de gamificação (pontos, nível)
- ✅ Estatísticas de atividade (check-ins, cupons, avaliações)
- ✅ Informações da conta (ID, cadastro, última atualização, último acesso)
- ✅ Ações: Banir/Desbanir, Excluir
- ✅ Layout em seções organizadas
- ✅ Navegação integrada

**Arquivo:**
- `src/screens/UserDetailsScreen.tsx` (550+ linhas)

#### Service e Navegação
- ✅ TypeScript service completo (133 linhas)
- ✅ Interfaces: User, UserFilters, UserListResponse, UserStatistics
- ✅ 6 métodos: listar, buscarPorId, banir, desbanir, deletar, estatisticas
- ✅ Stack navigator integrado
- ✅ Tab com ícone people

**Arquivos:**
- `src/services/usersService.ts`
- `src/navigation/UsersStackNavigator.tsx`

**Status:** ✅ **100% Funcional**

---

### 7. Navegação
- ✅ Bottom Tabs (Dashboard, Usuários, Pontos, Negócios, Cupons, Análises, Perfil)
- ✅ Stack Navigators para cada seção
- ✅ Drawer Navigator (menu lateral)
- ✅ Headers personalizados
- ✅ Navegação condicional (autenticado/não autenticado)

**Arquivos:**
- `src/navigation/TabNavigator.tsx`
- `src/navigation/DrawerNavigator.tsx`
- `src/navigation/PontosStackNavigator.tsx`
- `src/navigation/NegociosStackNavigator.tsx`
- `src/navigation/CuponsStackNavigator.tsx`
- `src/navigation/UsersStackNavigator.tsx`

---

## 🎨 Design System

### Cores Principais
```typescript
colors: {
  primary: '#FF8C00',      // Laranja BORALI
  secondary: '#FF6B00',    // Laranja escuro
  background: '#F5F5F5',   // Cinza claro
  white: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50',
}
```

### Tipografia
- **Extra Large:** 28px (títulos principais)
- **Large:** 20px (títulos secundários)
- **Medium:** 16px (texto padrão)
- **Small:** 14px (legendas)

### Espaçamentos
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **xxl:** 48px
- **xxxl:** 60px (margem superior headers)

**Arquivo:**
- `src/styles/theme.ts`

---

## 🔧 Serviços (API Clients)

### 1. Auth Service
- Login, logout, registro
- Recuperação e reset de senha
- Gestão de tokens (localStorage)
- Validação de autenticação

### 2. Pontos Service
- CRUD completo
- Listagem com filtros
- Estatísticas
- Busca por proximidade

### 3. Negócios Service
- CRUD completo
- Aprovação/rejeição
- Atualização de status de assinatura
- Estatísticas (MRR, ARR)
- Busca por proximidade

### 4. Cupons Service
- CRUD completo
- Aprovação/rejeição com motivo
- Alternar status (ativar/pausar)
- Registro de cliques
- Resgate de cupom
- Estatísticas

### 5. Users Service
- Listar com filtros (busca, status)
- Buscar por ID
- Banir/Desbanir com motivo
- Deletar usuário
- Estatísticas completas (total, ativos, banidos, gamificação, top usuários)

### 6. Error Service
- Tratamento centralizado de erros
- Categorização (NETWORK, AUTH, VALIDATION, etc.)
- Alertas customizados
- Confirmações

**Arquivos:**
- `src/services/authService.ts`
- `src/services/pontosService.ts`
- `src/services/negociosService.ts`
- `src/services/cuponsService.ts`
- `src/services/usersService.ts`
- `src/services/errorService.ts`
- `src/services/api.ts`

---

## 📊 Backend Integrado

### Endpoints Utilizados

#### Autenticação
- `POST /usuarios/login`
- `POST /usuarios/register`
- `POST /usuarios/forgot-password`
- `POST /usuarios/reset-password`

#### Negócios
- `GET /negocios` (com filtros)
- `POST /negocios`
- `GET /negocios/:id`
- `PUT /negocios/:id`
- `DELETE /negocios/:id`
- `PATCH /negocios/:id/aprovar`
- `PATCH /negocios/:id/rejeitar`
- `PATCH /negocios/:id/assinatura`
- `GET /negocios/estatisticas`
- `GET /negocios/proximos`

#### Pontos
- `GET /pontos` (com filtros)
- `POST /pontos`
- `GET /pontos/:id`
- `PUT /pontos/:id`
- `DELETE /pontos/:id`
- `GET /pontos/estatisticas`
- `GET /pontos/proximos`

#### Cupons
- `GET /cupons` (com filtros)
- `POST /cupons`
- `GET /cupons/:id`
- `PUT /cupons/:id`
- `DELETE /cupons/:id`
- `PATCH /cupons/:id/aprovar`
- `PATCH /cupons/:id/rejeitar`
- `PATCH /cupons/:id/status`
- `POST /cupons/:id/clique`
- `GET /cupons/estatisticas`
- `POST /cupons/:id/resgatar`

#### Usuários
- `GET /usuarios` (com filtros)
- `GET /usuarios/:id`
- `GET /usuarios/estatisticas`
- `PATCH /usuarios/:id/banir`
- `PATCH /usuarios/:id/desbanir`
- `DELETE /usuarios/:id`

**URL Base:** `https://borali-api.vercel.app`

---

## 📦 Dependências Principais

```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "@react-navigation/native": "^6.1.x",
  "@react-navigation/stack": "^6.4.x",
  "@react-navigation/bottom-tabs": "^6.6.x",
  "@react-navigation/drawer": "^6.7.x",
  "react-native-maps": "1.18.0",
  "expo-location": "~18.0.4",
  "expo-image-picker": "~16.0.3",
  "@react-native-picker/picker": "2.11.1",
  "axios": "^1.7.9",
  "@react-native-async-storage/async-storage": "2.1.0"
}
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Expo Go (para testar em dispositivo)

### Instalação
```bash
cd app/borali-suporte
npm install
```

### Desenvolvimento
```bash
npm start
```

### Build (Android)
```bash
npx expo build:android
```

### Build (iOS)
```bash
npx expo build:ios
```

---

## ⏭️ Próximos Passos

### Sprint 2 - Gestão de Conteúdo (Semanas 3-4) ✅ CONCLUÍDO

#### 1. Sistema de Cupons/Ofertas ✅
- ✅ Model backend (Cupom) - 271 linhas
- ✅ Controller com CRUD - 426 linhas, 11 métodos
- ✅ Tela de listagem de cupons - 785 linhas
- ✅ Formulário criar/editar cupom - 500+ linhas
- ✅ Aprovação/rejeição de cupons com modal customizado
- ✅ Filtros por status (Ativos, Pausados, Expirados)
- ✅ Busca otimizada com botão e Enter
- ✅ Tracking de resgates e estatísticas
- ✅ Deployed e testado em produção
- ✅ Documentação completa (TESTES-CUPONS.md)

**Correções Aplicadas:**
- ✅ Fix: Removido `next()` dos middlewares pre-save (Mongoose moderno)
- ✅ Fix: Modal de rejeição (Alert.prompt não existe no React Native)
- ✅ Fix: Layout de botões (position absolute → flexbox condicional)
- ✅ UX: Barra de busca alinhada com padrão da tela de pontos

**Data de Conclusão:** 09/01/2026

---

### Sprint 3 - Gestão de Usuários (Semanas 5-6) ✅ CONCLUÍDO

#### 1. Gestão de Usuários ✅
- ✅ Backend: Modelo Usuario expandido com gamificação (pontos, nivel, conquistas)
- ✅ Backend: Controller com 6 métodos admin (listar, buscarPorId, banir, desbanir, deletar, estatisticas)
- ✅ Backend: Routes protegidas com authMiddleware
- ✅ Frontend: usersService.ts com TypeScript interfaces completas
- ✅ Frontend: UsersListScreen com busca, filtros (Ativos/Banidos), paginação
- ✅ Frontend: UserDetailsScreen com perfil completo, estatísticas, badges
- ✅ Frontend: UsersStackNavigator integrado no TabNavigator
- ✅ Funcionalidades: Listar, banir, desbanir, deletar usuários
- ✅ Estatísticas: Total, ativos, banidos, pontos, check-ins, cupons resgatados, top 10
- ✅ UI: Cards com avatar, badges de status, ações inline
- ✅ Deployed e funcional em produção

**Data de Conclusão:** 13/01/2026

---

### Sprint 4 - Conteúdo e Análises (Semanas 7-8)

#### 1. Upload de Imagens
- [ ] Integração com Cloudinary/AWS S3
- [ ] Compressão automática
- [ ] Crop e edição básica
- [ ] Galeria de imagens do ponto/negócio/cupom
- [ ] Reordenação de fotos

#### 2. Analytics Avançado
- [ ] Gráficos de crescimento
- [ ] Funil de conversão
- [ ] Mapa de calor de visitas
- [ ] Relatórios exportáveis (PDF/CSV)
- [ ] Comparação períodos

---

### Sprint 5 - Gamificação (Semanas 9-10)

#### 1. Configuração de Pontos
- [ ] Definir pontos por ação (check-in, avaliação, etc.)
- [ ] Multiplicadores por categoria
- [ ] Eventos especiais
- [ ] Histórico de alterações

#### 2. Sistema de Álbum
- [ ] Criar figurinhas
- [ ] Associar figurinhas a locais
- [ ] Definir raridade
- [ ] Visualizar coleções dos usuários
- [ ] Estatísticas de completude

#### 3. Conquistas
- [ ] Criar conquistas
- [ ] Definir critérios
- [ ] Badges personalizados
- [ ] Premiações

#### 4. Missões
- [ ] Criar missões diárias/semanais
- [ ] Definir recompensas
- [ ] Acompanhar progresso
- [ ] Rotação automática

---

### Sprint 4 - Integração (Semanas 11-12)

#### 1. Notificações Push
- [ ] Integração Expo Notifications
- [ ] Envio manual
- [ ] Agendamento
- [ ] Segmentação (localização, perfil)
- [ ] Templates

#### 2. Relatórios
- [ ] Dashboard executivo
- [ ] Relatório mensal automático
- [ ] KPIs principais
- [ ] Exportação

#### 3. Sistema de Suporte
- [ ] Chat com usuários
- [ ] Tickets de suporte
- [ ] Base de conhecimento
- [ ] FAQs

---

## 🐛 Issues Conhecidos

1. **Compatibilidade Picker:** Versão 2.11.1 necessária (resolvido)
2. **Coordenadas:** Backend usa GeoJSON [lng, lat], frontend usa [lat, lng] - mapeamento implementado
3. **Imagens grandes:** Validação de 1MB no cliente, considerar compressão automática

### ✅ Issues Corrigidos - Sistema de Cupons
1. ✅ **"next is not a function":** Removido `next()` dos middlewares pre-save síncronos no Cupom.js
2. ✅ **Botão rejeitar não funciona:** Substituído Alert.prompt (inexistente) por modal customizado
3. ✅ **Botões sobrepostos:** Removido position absolute, implementado layout condicional por status
4. ✅ **Barra de busca inconsistente:** Alinhada com padrão da tela de pontos (ícone + botões)

---

## 📝 Notas Técnicas

### Geolocalização
- MongoDB usa índice `2dsphere` para queries espaciais
- Coordenadas no formato GeoJSON: `[longitude, latitude]`
- Raio padrão de busca: 50km (50000 metros)

### Autenticação
- JWT com expiração de 24h
- Token armazenado em AsyncStorage
- Interceptor axios renova automaticamente

### Paginação
- Padrão: 10-20 itens por página
- Infinite scroll em listas longas
- Total de páginas calculado no backend

### Validações
- Frontend: validação visual imediata
- Backend: validação com Joi/Express-validator
- Mensagens de erro padronizadas

---

## 📞 Suporte

**Documentação Completa:** [README Principal](./README.md)  
**Visão do Produto:** [BORALI-VISAO-PRODUTO.md](../../BORALI-VISAO-PRODUTO.md)  
**Testes de Cupons:** [TESTES-CUPONS.md](./TESTES-CUPONS.md)

---

**Última Atualização:** 13/01/2026  
**Versão:** 0.5.0-alpha  
**Sprint 3 Concluída:** Gestão de Usuários 100% Funcional ✅
