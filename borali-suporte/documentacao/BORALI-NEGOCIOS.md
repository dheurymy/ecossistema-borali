# 📱 BORALI Negócios - App para Parceiros

**Status:** 📋 Em planejamento  
**Plataforma:** React Native + Expo SDK 54  
**Público:** Empresas parceiras (hotéis, restaurantes, guias, lojas)  

---

## 🎯 Objetivo

Aplicativo para negócios gerenciarem seu perfil na plataforma BORALI, criarem ofertas/cupons, acompanharem métricas de desempenho e interagirem com clientes de forma eficiente.

---

## 💼 Proposta de Valor para Negócios

### Para o Estabelecimento
- ✅ Visibilidade em plataforma de turismo gamificada
- 📊 Analytics de visitação e engajamento
- 🎟️ Sistema próprio de cupons e ofertas
- 💰 Aumento de fluxo de clientes (+20% validado)
- 📱 Gestão mobile simples e rápida
- 🎯 Marketing direcionado a turistas

### Modelo de Assinatura
- **Plano Básico:** R$ 49,99/mês
  - Perfil completo
  - Até 5 cupons/mês
  - Analytics básico
  - 1 usuário

- **Plano Plus:** R$ 99,99/mês
  - Tudo do Básico
  - Cupons ilimitados
  - Analytics avançado
  - Destaque no app
  - 3 usuários

- **Plano Premium:** R$ 199,99/mês
  - Tudo do Plus
  - Anúncios patrocinados
  - Consultoria de marketing
  - API de integração
  - Usuários ilimitados

### Trial
- **90 dias grátis** para testar
- Sem cartão de crédito necessário
- Acesso completo ao Plano Plus

---

## 🗂️ Funcionalidades Planejadas

### 1. Cadastro e Onboarding
- [ ] Registro inicial (CNPJ, contato, categoria)
- [ ] Upload de documentos (CNPJ, comprovante)
- [ ] Aprovação pela equipe BORALI (automática via app Suporte)
- [ ] Tutorial interativo
- [ ] Setup do perfil

### 2. Gestão de Perfil
- [ ] Dados básicos (nome, descrição, categoria)
- [ ] Endereço e coordenadas (mapa integrado)
- [ ] Horários de funcionamento
- [ ] Upload de logo e fotos (galeria)
- [ ] Contatos (telefone, WhatsApp, redes sociais)
- [ ] Tags e categorias
- [ ] Faixa de preço
- [ ] Formas de pagamento aceitas
- [ ] Informações de acessibilidade

### 3. Sistema de Cupons/Ofertas
- [ ] Criar novo cupom:
  - Título e descrição
  - Valor/percentual de desconto
  - Código único (gerado automaticamente)
  - Validade (data início/fim)
  - Limite de resgates
  - Regras e restrições
  - Categorias de clientes (novos/recorrentes)
- [ ] Editar cupons ativos
- [ ] Pausar/reativar ofertas
- [ ] Duplicar cupons
- [ ] Templates pré-definidos
- [ ] Aprovação automática (dentro dos limites do plano)

### 4. Dashboard Analytics
- [ ] **Visão Geral:**
  - Total de visualizações do perfil
  - Check-ins no local
  - Cupons resgatados
  - Avaliação média
  - Posição no ranking

- [ ] **Gráficos:**
  - Visitação nos últimos 30 dias
  - Horários de pico
  - Dias da semana mais movimentados
  - Origem dos visitantes (localização)

- [ ] **Performance de Cupons:**
  - Taxa de conversão por cupom
  - Cupons mais populares
  - Valor economizado pelos clientes
  - ROI estimado

- [ ] **Comparativos:**
  - Sua categoria vs média
  - Mês atual vs mês anterior
  - Benchmark da região

### 5. Gestão de Clientes
- [ ] Lista de clientes que visitaram
- [ ] Histórico de resgates
- [ ] Clientes frequentes (VIPs)
- [ ] Exportar lista de emails (LGPD compliant)
- [ ] Enviar mensagem broadcast (via app)

### 6. Avaliações e Feedback
- [ ] Visualizar todas as avaliações
- [ ] Responder comentários
- [ ] Denunciar avaliações ofensivas
- [ ] Filtros (por nota, data, palavras-chave)
- [ ] Insights automáticos (IA)
  - Pontos positivos mais mencionados
  - Áreas de melhoria
  - Tendências ao longo do tempo

### 7. Notificações
- [ ] Novo cupom resgatado
- [ ] Nova avaliação
- [ ] Check-in no estabelecimento
- [ ] Metas atingidas
- [ ] Vencimento de ofertas
- [ ] Pagamento de assinatura

### 8. Financeiro
- [ ] Detalhes da assinatura
- [ ] Histórico de pagamentos
- [ ] Nota fiscal
- [ ] Alterar plano
- [ ] Gerenciar forma de pagamento
- [ ] Cancelamento

### 9. Suporte
- [ ] Chat com equipe BORALI
- [ ] Base de conhecimento
- [ ] Tutoriais em vídeo
- [ ] FAQs

---

## 🎨 Design Proposto

### Cores
- **Primary:** #FF8C00 (Laranja BORALI)
- **Secondary:** #2C3E50 (Azul escuro profissional)
- **Success:** #27AE60 (Verde)
- **Warning:** #F39C12 (Amarelo)
- **Danger:** #E74C3C (Vermelho)

### Estilo Visual
- Design **profissional** e clean
- Cards com dados relevantes
- Gráficos interativos
- Dashboard estilo CRM
- Modo claro/escuro

---

## 📱 Navegação

### Bottom Tabs
1. **Home** (Dashboard)
2. **Cupons** (Gestão de ofertas)
3. **Perfil** (Editar informações)
4. **Clientes** (Lista e histórico)
5. **Mais** (Configurações, suporte, financeiro)

### Fluxo Principal
```
Login/Registro
    ↓
Onboarding (se novo)
    ↓
Dashboard
    ├─→ Ver Gráficos
    ├─→ Criar Cupom
    ├─→ Editar Perfil
    ├─→ Ver Avaliações
    └─→ Configurações
```

---

## 🔧 Tecnologias Planejadas

### Frontend
- React Native + Expo
- TypeScript
- React Navigation
- React Native Charts (victory-native)
- React Query (cache e sync)
- Expo Notifications

### Backend (compartilhado)
- API REST existente
- Endpoints específicos para negócios
- WebSockets para notificações real-time

---

## 🚀 Roadmap de Desenvolvimento

### Fase 1 - Estrutura Base (Sprint 7-8)
- [ ] Setup do projeto
- [ ] Navegação
- [ ] Autenticação
- [ ] Telas básicas (sem dados)

### Fase 2 - Perfil e Cupons (Sprint 9-10)
- [ ] Gestão de perfil completa
- [ ] Sistema de cupons (CRUD)
- [ ] Upload de imagens
- [ ] Validação de dados

### Fase 3 - Analytics (Sprint 11)
- [ ] Dashboard com métricas
- [ ] Gráficos interativos
- [ ] Exportação de relatórios

### Fase 4 - Clientes e Avaliações (Sprint 12)
- [ ] Lista de clientes
- [ ] Gestão de avaliações
- [ ] Notificações

### Fase 5 - Financeiro e Suporte (Pré-lançamento)
- [ ] Integração pagamentos
- [ ] Chat de suporte
- [ ] Ajustes finais
- [ ] Beta testing com parceiros reais

---

## 📊 Métricas de Sucesso

### Para BORALI
- **Taxa de adoção:** >80% dos parceiros usando o app
- **Engagement:** Login semanal >60%
- **Churn rate:** <10% ao mês
- **NPS:** >50

### Para Negócios
- **Tempo de setup:** <10 minutos
- **Cupons criados:** Média 5+ por mês
- **Taxa de resgate:** >30%
- **ROI positivo:** Em até 3 meses

---

## 🎯 Diferenciais Competitivos

1. **Simplicidade:** Interface intuitiva, sem curva de aprendizado
2. **Gratuito Inicial:** 90 dias trial completo
3. **Analytics Automático:** Sem necessidade de integração
4. **Suporte Dedicado:** Time disponível via chat
5. **Marketing Incluído:** Visibilidade no app principal
6. **Mobile-first:** Gestão de qualquer lugar

---

## 💡 Funcionalidades Futuras

- **QR Code próprio:** Para check-ins e validação de cupons
- **Programa de fidelidade:** Criar cartão fidelidade digital
- **Reservas:** Aceitar reservas pelo app
- **Cardápio digital:** Para restaurantes
- **Integração POS:** Sincronizar com sistema de caixa
- **Campanhas pagas:** Anúncios dentro do app usuário
- **Multi-unidades:** Gerenciar várias filiais
- **API pública:** Integração com outros sistemas

---

## 🔐 Segurança e Compliance

- Autenticação segura (JWT)
- Dados criptografados
- LGPD compliance
- Backup diário
- Auditoria de ações
- Controle de permissões (multi-usuário)

---

## 📄 Fluxo de Cadastro

```
1. Download do App
   ↓
2. Tela Inicial
   - Opção "Já tenho cadastro"
   - Opção "Cadastrar Negócio"
   ↓
3. Formulário Inicial
   - CNPJ
   - Nome do negócio
   - Categoria
   - Telefone/Email
   ↓
4. Verificação de Email
   - Código enviado por email
   ↓
5. Dados Complementares
   - Endereço
   - Descrição
   - Logo
   ↓
6. Escolha de Plano
   - Mostrar comparativo
   - Destacar Trial gratuito
   ↓
7. Aguardar Aprovação
   - Notificação: "Em análise pela equipe BORALI"
   - Email de confirmação
   ↓
8. Aprovado!
   - Notificação push
   - Tutorial interativo
   - Dashboard liberado
```

---

## 🤝 Integração com App Suporte

O app de Negócios se comunica com o app Suporte em vários pontos:

1. **Cadastros:** Novos negócios aparecem no Suporte para aprovação
2. **Cupons:** Aprovação/rejeição se necessário
3. **Denúncias:** Avaliações denunciadas vão para moderação
4. **Suporte:** Tickets de atendimento gerenciados no Suporte
5. **Analytics:** Dados agregados para relatórios gerenciais

---

## 📞 Documentos Relacionados

- [README Principal](./README.md)
- [BORALI Suporte](./BORALI-SUPORTE.md)
- [BORALI App](./BORALI-APP.md)
- [Visão do Produto](../../BORALI-VISAO-PRODUTO.md)

---

**Última Atualização:** 09/01/2026  
**Status:** Planejamento  
**Previsão de Início:** Sprint 7 (Semana 7-8)
