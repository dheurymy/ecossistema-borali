# 📱 BORALI App - Aplicativo do Usuário Final

**Status:** 📋 Em planejamento  
**Plataforma:** React Native + Expo SDK 54  
**Público:** Turistas e viajantes no Maranhão  

---

## 🎯 Objetivo

Aplicativo gamificado que transforma a experiência turística em uma jornada de descobertas, incentivando visitantes a explorarem pontos turísticos e comerciais locais através de recompensas e colecionáveis.

---

## 🎮 Conceito de Gamificação

### Sistema de Pontos
- **Check-in em locais:** 10-50 pontos (varia por raridade)
- **Avaliar estabelecimento:** 5 pontos
- **Compartilhar experiência:** 3 pontos
- **Completar missões:** 20-100 pontos
- **First visit (primeira visita):** Bônus de 2x pontos

### Álbum de Figurinhas
- Cada ponto de interesse possui uma figurinha exclusiva
- Raridades: Comum, Incomum, Rara, Épica, Lendária
- Coleção completa por região desbloqueia recompensas especiais
- Sistema de troca entre usuários (futuro)

### Conquistas (Achievements)
- **Explorador Iniciante:** Visitar 5 locais
- **Conhecedor Local:** Visitar 20 locais
- **Mestre dos Lençóis:** Visitar todos os pontos dos Lençóis Maranhenses
- **Crítico Gastronômico:** Avaliar 10 restaurantes
- **Fotógrafo Viajante:** Upload de 50 fotos
- E muitas outras...

---

## 🗺️ Funcionalidades Planejadas

### 1. Onboarding e Perfil
- [ ] Tutorial interativo com gamificação
- [ ] Cadastro/Login (email, Google, Apple)
- [ ] Criação de avatar/nickname
- [ ] Escolha de interesses (praias, aventura, cultura, gastronomia)
- [ ] Perfil com nível, pontos e conquistas
- [ ] Histórico de visitas

### 2. Mapa Interativo
- [ ] Visualização de pontos próximos
- [ ] Filtros por categoria e distância
- [ ] Marcadores com níveis de raridade
- [ ] Rotas sugeridas (otimizadas por distância)
- [ ] Navegação integrada (Google Maps/Waze)
- [ ] Modo offline com cache de mapas

### 3. Rotas Personalizadas
- [ ] IA gera roteiros baseados em:
  - Tempo disponível
  - Interesses do usuário
  - Localização atual
  - Clima/época do ano
- [ ] Rotas temáticas:
  - Histórica e Cultural
  - Praias e Natureza
  - Gastronomia Local
  - Aventura e Ecoturismo
- [ ] Estimativa de custos
- [ ] Compartilhamento de rotas

### 4. Check-in e Descobertas
- [ ] Check-in por GPS (raio de 100m)
- [ ] Verificação por QR Code (locais parceiros)
- [ ] Animação de ganho de pontos e figurinha
- [ ] Foto obrigatória (prova de visita)
- [ ] Feedback imediato (conquistas desbloqueadas)

### 5. Álbum de Figurinhas
- [ ] Visualização do álbum por região
- [ ] Indicador de progresso (X/Y coletadas)
- [ ] Filtros (coletadas, faltantes, por raridade)
- [ ] Detalhes da figurinha (local, história, curiosidades)
- [ ] Sistema de troca (match entre usuários)
- [ ] Recompensas por coleção completa

### 6. Cupons e Ofertas
- [ ] Feed de ofertas de parceiros
- [ ] Filtros por categoria e localização
- [ ] Resgate de cupons com código
- [ ] Validade e regras claras
- [ ] Histórico de cupons usados
- [ ] Notificação de novas ofertas

### 7. Avaliações e Comentários
- [ ] Sistema de estrelas (1-5)
- [ ] Comentário com fotos
- [ ] Tags predefinidas (limpo, acessível, bom atendimento)
- [ ] Ordenação (mais recentes, mais úteis)
- [ ] Denúncia de conteúdo inapropriado

### 8. Missões Diárias/Semanais
- [ ] Lista de missões ativas
- [ ] Progresso visual
- [ ] Recompensas atrativas
- [ ] Missões especiais em eventos
- [ ] Notificações de novas missões

### 9. Ranking e Social
- [ ] Ranking global e regional
- [ ] Ranking de amigos
- [ ] Perfis públicos
- [ ] Seguir outros viajantes
- [ ] Feed de atividades
- [ ] Compartilhar no Instagram/Facebook

### 10. Informações Turísticas
- [ ] Descrição detalhada de cada ponto
- [ ] Fotos em alta qualidade
- [ ] Horários de funcionamento
- [ ] Valores aproximados
- [ ] Dicas de visitantes
- [ ] Como chegar
- [ ] Melhor época para visitar

---

## 🎨 Design Proposto

### Cores
- **Primary:** #FF8C00 (Laranja BORALI)
- **Secondary:** #00A86B (Verde Maranhão)
- **Accent:** #FFD700 (Dourado - recompensas)
- **Background:** Degradê sutil laranja/branco

### Estilo Visual
- **Cards modernos** com sombras suaves
- **Ícones illustrados** para categorias
- **Animações** em transições e conquistas
- **Micro-interações** para feedback
- **Mapas customizados** com tema próprio

### Componentes Principais
- Bottom Tabs: Mapa, Álbum, Cupons, Perfil
- Cards deslizáveis (swipeable)
- Modais animados
- Progress bars circulares
- Badges e conquistas em destaque

---

## 🔧 Tecnologias Planejadas

### Frontend
- **React Native** (código compartilhado iOS/Android)
- **Expo SDK 54+**
- **TypeScript** (type safety)
- **React Navigation** (navegação)
- **React Native Maps** (mapas)
- **Expo Location** (GPS)
- **Reanimated 3** (animações fluidas)
- **React Query** (cache e sync)

### Serviços Externos
- **Google Maps API** (mapas e rotas)
- **Firebase** (notificações push)
- **Cloudinary** (upload de fotos)
- **Socket.io** (chat e notificações real-time)

### Backend (compartilhado)
- API REST Node.js/Express
- MongoDB com geospatial queries
- Autenticação JWT
- Rate limiting

---

## 📊 Métricas de Sucesso

### Engajamento
- **MAU** (Monthly Active Users): Meta 1.000 no primeiro trimestre
- **Check-ins diários:** Meta 50+
- **Taxa de retenção:** >40% após 7 dias
- **Tempo médio na app:** >15 minutos/sessão

### Gamificação
- **Figurinhas coletadas:** Média 15+ por usuário
- **Conquistas desbloqueadas:** Média 5+ por usuário
- **Cupons resgatados:** Taxa de conversão >30%

### Negócios
- **Visitas geradas:** +20% de tráfego para parceiros
- **Avaliações:** Média 4+ estrelas
- **ROI parceiros:** Custo/visita <R$ 5

---

## 🚀 Roadmap de Desenvolvimento

### Fase 1 - MVP (Sprint 5-6)
- [ ] Estrutura base do app
- [ ] Autenticação
- [ ] Mapa com pontos
- [ ] Check-in básico
- [ ] Álbum de figurinhas (visualização)
- [ ] Perfil do usuário

### Fase 2 - Gamificação (Sprint 7-8)
- [ ] Sistema de pontos completo
- [ ] Conquistas
- [ ] Missões diárias
- [ ] Ranking

### Fase 3 - Social e Cupons (Sprint 9-10)
- [ ] Feed de atividades
- [ ] Sistema de cupons
- [ ] Avaliações
- [ ] Notificações push

### Fase 4 - IA e Personalização (Sprint 11-12)
- [ ] Rotas personalizadas
- [ ] Recomendações inteligentes
- [ ] Análise de comportamento
- [ ] Sistema de troca de figurinhas

### Fase 5 - Polimento (Pré-lançamento)
- [ ] Testes de usabilidade
- [ ] Performance optimization
- [ ] Tradução (PT/EN/ES)
- [ ] Onboarding refinado
- [ ] Beta testing com usuários reais

---

## 🎯 Diferenciais Competitivos

1. **Gamificação Nativa:** Único app com álbum de figurinhas turísticas
2. **Foco Regional:** Especializado no Maranhão, não genérico
3. **Rotas IA:** Personalização real baseada em comportamento
4. **Parceiros Locais:** Cupons exclusivos de negócios da região
5. **Offline-first:** Funciona sem internet após download inicial
6. **Cultura Local:** Conteúdo culturalmente relevante e autêntico

---

## 💡 Ideias Futuras

- **Modo Família:** Álbum compartilhado entre membros
- **Desafios entre amigos:** Competir por mais pontos
- **Eventos especiais:** Figurinhas raras temporárias
- **Integração Turismo MA:** Parceria com governo estadual
- **Loja de recompensas:** Trocar pontos por prêmios físicos
- **AR (Realidade Aumentada):** Figurinhas em 3D no local
- **Podcasts locais:** Histórias narradas sobre os pontos

---

## 📱 Fluxo do Usuário (User Journey)

1. **Download e Cadastro** → Tutorial gamificado
2. **Escolha de Interesses** → IA aprende preferências
3. **Ver Mapa** → Descobre pontos próximos
4. **Escolher Rota ou Local** → Decide o que visitar
5. **Navegar até o Local** → GPS integrado
6. **Check-in** → Ganha pontos e figurinha
7. **Tirar Foto/Avaliar** → Pontos extras
8. **Ver Álbum** → Acompanha progresso
9. **Resgatar Cupom** → Usa recompensa
10. **Compartilhar** → Viralização

---

## 🔐 Privacidade e Segurança

- Dados de localização criptografados
- Opt-in para compartilhamento de localização
- LGPD compliance
- Moderação de conteúdo
- Sistema de denúncias
- Dados anonimizados para analytics

---

## 📄 Documentos Relacionados

- [README Principal](./README.md)
- [BORALI Suporte](./BORALI-SUPORTE.md)
- [Visão do Produto](../../BORALI-VISAO-PRODUTO.md)

---

**Última Atualização:** 09/01/2026  
**Status:** Planejamento  
**Previsão de Início:** Sprint 5 (Semana 9)
