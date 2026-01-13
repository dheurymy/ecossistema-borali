# 📚 Documentação - Ecossistema BORALI

## Visão Geral

O ecossistema BORALI é composto por 3 aplicativos complementares que formam uma plataforma completa de turismo gamificado no Maranhão.

## 📱 Aplicativos

### 1. [BORALI App - Usuário Final](./BORALI-APP.md)
**Plataforma:** React Native (Expo)  
**Público:** Turistas e viajantes  
**Status:** Em planejamento  

Aplicativo principal para usuários finais explorarem destinos turísticos através de gamificação.

---

### 2. [BORALI Negócios](./BORALI-NEGOCIOS.md)
**Plataforma:** React Native (Expo)  
**Público:** Empresas parceiras (hotéis, restaurantes, guias)  
**Status:** Em planejamento  

Aplicativo para negócios gerenciarem seu perfil, ofertas e cupons.

---

### 3. [BORALI Suporte](./BORALI-SUPORTE.md)
**Plataforma:** React Native (Expo)  
**Público:** Equipe administrativa  
**Status:** ✅ **Em desenvolvimento ativo**  

Aplicativo para gerenciar negócios, pontos de interesse e conteúdo da plataforma.

---

## 🏗️ Arquitetura Técnica

### Backend (API)
- **Framework:** Node.js + Express
- **Database:** MongoDB Atlas
- **Deploy:** Vercel
- **URL:** `https://borali-api.vercel.app`

### Frontend (Apps)
- **Framework:** React Native + TypeScript
- **SDK:** Expo SDK 54
- **Navegação:** React Navigation v6
- **Maps:** react-native-maps (Google)
- **State:** React Hooks + Context API

---

## 📂 Estrutura de Pastas

```
borali-app/
├── api/                          # Backend Node.js
│   ├── controllers/              # Lógica de negócio
│   ├── models/                   # Schemas MongoDB
│   ├── routes/                   # Endpoints REST
│   ├── middleware/               # Autenticação, validação
│   └── services/                 # Serviços externos (email)
│
├── app/
│   ├── borali-app/              # App Usuário (planejado)
│   ├── borali-negocios/         # App Negócios (planejado)
│   ├── borali-suporte/          # App Suporte (em desenvolvimento)
│   │   ├── src/
│   │   │   ├── screens/         # Telas
│   │   │   ├── navigation/      # Navegação
│   │   │   ├── services/        # API clients
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   ├── styles/          # Temas e estilos
│   │   │   └── types/           # TypeScript types
│   │   └── assets/              # Imagens, fontes
│   └── documentacao/            # Esta pasta
│
└── BORALI-VISAO-PRODUTO.md      # Documento de visão completa
```

---

## 🎯 Modelo de Negócio

**Tipo:** B2B2C (Business-to-Business-to-Consumer)

### Receita Principal
- **R$ 49,99/mês** por negócio parceiro
- Período trial: 90 dias
- Planos: Básico, Plus, Premium

### Validação de Mercado
- 29/32 negócios demonstraram interesse (90,6%)
- Preço validado em pesquisa de campo
- Foco inicial: São Luís e Lençóis Maranhenses

---

## 📅 Roadmap - Próximos 90 Dias

### Sprint 1 - Fundação (Semanas 1-2) ✅
- [x] Gerenciamento de Pontos de Interesse
- [x] Gerenciamento de Negócios Parceiros
- [x] Dashboard com estatísticas
- [x] Sistema de autenticação

### Sprint 2 - Gestão de Conteúdo (Semanas 3-4)
- [ ] Sistema de Cupons/Ofertas
- [ ] Aprovação/rejeição de ofertas
- [ ] Gestão de usuários (CRUD)
- [ ] Upload e gestão de imagens

### Sprint 3 - Gamificação (Semanas 5-6)
- [ ] Configuração de pontos e recompensas
- [ ] Sistema de álbum/figurinhas
- [ ] Gestão de conquistas
- [ ] Missões diárias/semanais

### Sprint 4 - Integração (Semanas 7-8)
- [ ] Notificações push
- [ ] Relatórios e analytics
- [ ] Exportação de dados
- [ ] Sistema de suporte/chat

### Sprint 5 - Apps Finais (Semanas 9-12)
- [ ] BORALI App (Usuário)
- [ ] BORALI Negócios
- [ ] Testes integrados
- [ ] Preparação para lançamento

---

## 🔗 Links Importantes

- [Visão do Produto](../BORALI-VISAO-PRODUTO.md)
- [API Backend](../api/README.md)
- [App Suporte - Detalhes](./BORALI-SUPORTE.md)

---

## 👥 Equipe

- **Desenvolvimento:** 10-15h/semana durante período de edital
- **Prazo do Edital:** 3 meses
- **Objetivo:** MVP funcional antes do resultado do edital

---

**Última Atualização:** 09/01/2026
