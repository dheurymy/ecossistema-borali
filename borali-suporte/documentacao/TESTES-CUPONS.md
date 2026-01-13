# Sistema de Cupons - Guia de Testes

## ✅ Componentes Implementados

### Backend (API)
- ✅ **Model**: `api/models/Cupom.js` (271 linhas)
  - Schema completo com validações
  - Virtuals: `disponivel`, `taxaConversao`, `taxaUtilizacao`
  - Middleware: auto-geração de código, auto-atualização de status (sem next())
  - Métodos: `resgatar()`, `marcarUtilizado()`
  - **Fix aplicado**: Removido `next()` dos middlewares pre-save síncronos

- ✅ **Controller**: `api/controllers/CupomController.js` (426 linhas)
  - 11 métodos: CRUD completo + aprovação + estatísticas
  - Validações de negócio
  - Filtros e paginação
  - Padrão try/catch sem next() (Express 5 nativo)

- ✅ **Routes**: `api/routes/CupomRoutes.js`
  - Rotas RESTful protegidas com authMiddleware
  - Integrado em `api/server.js` em `/cupons`
  - Deployed em Vercel

### Frontend (App Borali Suporte)
- ✅ **Service**: `src/services/cuponsService.ts` (160 linhas)
  - TypeScript com interfaces completas
  - Todos os métodos da API

- ✅ **Navegação**: `src/navigation/CuponsStackNavigator.tsx`
  - Stack com CuponsList e CupomForm
  - Integrado no TabNavigator com ícone pricetag

- ✅ **Telas**:
  - `CuponsListScreen.tsx` (785 linhas): Lista com busca, filtros, aprovação, CRUD
    - Barra de busca com padrão da tela de pontos (ícone, botão buscar, botão limpar)
    - Modal customizado para rejeição de cupons
    - Botões de ação condicionais por status (pendente/aprovado/rejeitado)
  - `CupomFormScreen.tsx` (500+ linhas): Formulário criar/editar

## 🧪 Roteiro de Testes

### 1. Iniciar Servidores

**Backend:**
```bash
cd api
npm start
```
Servidor deve estar rodando em `http://localhost:3000`

**Frontend:**
```bash
cd app/borali-suporte
npx expo start -c
```

### 2. Testar Listagem de Cupons

1. Abrir app no emulador/dispositivo
2. Navegar até a aba "Cupons" (ícone de etiqueta)
3. **Verificar:**
   - Header laranja com título "Cupons e Ofertas"
   - Botão "+" no canto superior direito
   - Barra de busca
   - Filtros: Ativos, Pausados, Expirados
   - Lista vazia mostra mensagem "Nenhum cupom encontrado"

### 3. Criar Primeiro Cupom

1. Tocar no botão "+" no header
2. **Preencher formulário:**
   - **Título**: "20% de desconto em cervejas artesanais"
   - **Descrição**: "Válido para todas as cervejas artesanais da casa"
   - **Negócio**: Selecionar um negócio aprovado (deve aparecer no picker)
   - **Tipo**: Selecionar "Percentual (%)"
   - **Percentual**: "20"
   - **Código**: Deixar o gerado ou criar personalizado (ex: CERVEJA20)
   - **Data Início**: Data de hoje (pré-preenchida)
   - **Data Fim**: Data daqui 1 mês (pré-preenchida)
   - **Resgates ilimitados**: Deixar ativado OU desativar e definir limite (ex: 100)
   - **Regras**: "Não cumulativo com outras promoções"
   - **Valor Mínimo**: "50.00" (opcional)
   - **Primeira compra**: Ativar ou não (switch)

3. Tocar em "Salvar Cupom"
4. **Verificar:**
   - Alert "Cupom criado com sucesso!"
   - Redirecionamento para lista
   - Cupom aparece na lista com badge "pendente" (laranja)

### 4. Testar Aprovação de Cupom

1. Na lista, localizar o cupom criado
2. **Verificar card do cupom:**
   - Logo/ícone do tipo (etiqueta para percentual)
   - Título e nome do negócio
   - Badge com código (ex: CERVEJA20)
   - Descrição (2 linhas)
   - Datas de validade
   - Valor do desconto ("20% OFF")
   - Badges de status: "ativo" (verde) + "pendente" (laranja)
   - Estatísticas: visualizações, cliques, resgates
   - Botões: "Aprovar" (verde) e "Rejeitar" (vermelho)

3. Tocar em "Aprovar"
4. **Verificar:**
   - Alert "Cupom aprovado com sucesso!"
   - Badge de aprovação muda para "aprovado" (verde)
   - Botões de aprovação desaparecem
   - Aparecem botões: "Pausar" (laranja) e "Excluir" (vermelho)

### 5. Testar Edição de Cupom

1. Tocar sobre o card do cupom
2. Formulário abre com dados preenchidos
3. **Modificar:**
   - Alterar título para "25% de desconto em cervejas artesanais"
   - Alterar percentual para "25"
4. Tocar em "Salvar Cupom"
5. **Verificar:**
   - Alert "Cupom atualizado com sucesso!"
   - Volta para lista
   - Cupom mostra dados atualizados

### 6. Testar Filtros e Busca

**Busca:**
1. Digitar "cerveja" na barra de busca
2. Tocar no botão de busca (ícone de lupa azul) ou pressionar Enter
3. Verificar que cupom aparece filtrado
4. Tocar no X para limpar busca
5. **Verificar:**
   - Barra de busca tem ícone de lupa à esquerda
   - Input de texto no centro
   - Botão X aparece quando há texto
   - Botão de buscar (azul) à direita

**Filtros:**
1. Tocar em "Ativos" - deve mostrar apenas cupons ativos
2. Tocar novamente para desativar filtro
3. Criar um cupom com data de fim no passado
4. Tocar em "Expirados" - deve mostrar o cupom expirado

### 7. Testar Pausar/Reativar

1. Localizar cupom ativo e aprovado
2. Tocar no botão "Pausar" (ícone pause, botão laranja)
3. Confirmar no Alert
4. **Verificar:**
   - Badge de status muda para "pausado" (cinza)
   - Botão muda para "Ativar" (ícone play, botão verde)
   - Botão "Excluir" continua disponível
5. Tocar em "Ativar"
6. Status volta para "ativo" (verde)
7. Botão volta para "Pausar" (laranja)

### 8. Testar Rejeição de Cupom

1. Criar novo cupom
2. Tocar em "Rejeitar"
3. **Verificar:**
   - Modal aparece com título "Rejeitar Cupom"
   - Campo de texto multiline para motivo da rejeição
   - Placeholder descritivo
   - Botões "Cancelar" (cinza) e "Rejeitar" (vermelho)
4. Tentar rejeitar sem motivo
5. **Verificar:**
   - Alert de erro: "Motivo da rejeição é obrigatório"
6. Digitar motivo: "Desconto muito alto"
7. Tocar em "Rejeitar"
8. **Verificar:**
   - Modal fecha
   - Alert "Cupom rejeitado"
   - Badge muda para "rejeitado" (vermelho)
   - Apenas botão "Excluir" aparece

### 9. Testar Exclusão

**Cupom Aprovado:**
1. Localizar cupom aprovado (ativo ou pausado)
2. Tocar no botão "Excluir" (vermelho)
3. Confirmar exclusão no Alert
4. **Verificar:**
   - Alert "Cupom excluído com sucesso!"
   - Cupom desaparece da lista

**Cupom Rejeitado:**
1. Localizar cupom rejeitado
2. Tocar no botão "Excluir" (único botão disponível)
3. Confirmar exclusão
4. **Verificar:**
   - Cupom é removido da lista
   - Permite limpeza de cupons rejeitados

### 10. Testar Validações do Formulário

**Campos obrigatórios:**
1. Tentar salvar cupom sem título → Erro: "Por favor, informe o título"
2. Tentar salvar sem descrição → Erro: "Por favor, informe a descrição"
3. Tentar salvar sem percentual/valor → Erro correspondente

**Validações de lógica:**
1. Definir data início DEPOIS da data fim → Erro: "Data de início deve ser anterior à data de fim"
2. Definir percentual > 100 → Erro: "Percentual deve estar entre 1 e 100"
3. Definir código < 6 caracteres → Erro: "Código deve ter no mínimo 6 caracteres"

**Validações de tipo:**
1. Selecionar "Percentual" mas não preencher percentual → Erro
2. Selecionar "Valor Fixo" mas não preencher valor → Erro

### 11. Testar Recursos Avançados

**Código automático:**
1. Abrir formulário novo cupom
2. Tocar no ícone de refresh ao lado do código
3. Verificar que gera código aleatório de 8 caracteres

**Switch de limite:**
1. Desativar "Resgates ilimitados"
2. Campo "Limite" aparece
3. Ativar novamente
4. Campo desaparece

**Restrições:**
1. Criar cupom com valor mínimo de R$ 100
2. Ativar "primeira compra"
3. Salvar e editar
4. Verificar que valores são mantidos

### 12. Testar Paginação

1. Criar mais de 10 cupons
2. Rolar lista até o fim
3. **Verificar:**
   - Spinner de loading aparece
   - Mais cupons são carregados
4. Puxar para baixo (pull-to-refresh)
5. Lista recarrega do início

## 📊 Endpoints da API para Teste Manual

### Listar Cupons
```bash
GET http://localhost:3000/cupons
Headers: Authorization: Bearer {token}
Query params: ?page=1&limit=10&statusCupom=ativo&tipo=percentual&busca=cerveja
```

### Buscar por ID
```bash
GET http://localhost:3000/cupons/{id}
Headers: Authorization: Bearer {token}
```

### Criar Cupom
```bash
POST http://localhost:3000/cupons
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json
Body:
{
  "titulo": "50% OFF em hambúrgueres",
  "descricao": "Válido de segunda a quinta-feira",
  "negocio": "{negocioId}",
  "tipo": "percentual",
  "percentualDesconto": 50,
  "codigo": "BURGER50",
  "dataInicio": "2026-01-09",
  "dataFim": "2026-02-09",
  "limiteResgates": 50,
  "regras": "Não cumulativo",
  "restricoes": {
    "valorMinimo": 30,
    "primeiraCompra": false
  }
}
```

### Aprovar Cupom
```bash
PATCH http://localhost:3000/cupons/{id}/aprovar
Headers: Authorization: Bearer {token}
```

### Rejeitar Cupom
```bash
PATCH http://localhost:3000/cupons/{id}/rejeitar
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json
Body:
{
  "motivoRejeicao": "Desconto muito alto"
}
```

### Estatísticas
```bash
GET http://localhost:3000/cupons/estatisticas
Headers: Authorization: Bearer {token}
Query params: ?negocioId={id} (opcional)
```

## 🐛 Checklist de Bugs Comuns

- [ ] Negócios não aparecem no picker → Verificar se existem negócios aprovados
- [ ] Erro ao salvar → Verificar console do backend para validações
- [ ] Data inválida → Usar formato YYYY-MM-DD
- [ ] Código duplicado → Gerar novo código ou usar único
- [ ] Botões de aprovação não aparecem → Verificar se statusAprovacao === 'pendente'
- [ ] Não consegue pausar → Verificar se cupom está expirado/esgotado
- [x] ~~Botão rejeitar não funciona → Fixed: Alert.prompt não existe no React Native~~
- [x] ~~Botões sobrepostos após aprovação → Fixed: Refatorada estrutura de botões por status~~
- [x] ~~Erro "next is not a function" → Fixed: Removido next() dos middlewares síncronos~~

## 🔧 Correções Aplicadas

### Backend
1. **Cupom.js**: Removido `next()` dos middlewares pre-save síncronos (linhas 185 e 195-215)
   - Mongoose moderno não requer next() em middlewares síncronos
   - Fix deploy: `git commit -m "fix(cupom): remover next() dos middlewares pre-save"`

2. **CupomController.js**: Padrão try/catch sem next()
   - Express 5 tem suporte nativo a async/await
   - 426 linhas com todos os métodos seguindo mesmo padrão

### Frontend
1. **Barra de busca**: Alinhada com padrão da tela de pontos
   - Ícone search-outline à esquerda
   - Botão de buscar azul à direita
   - Botão limpar quando há texto
   - Estados separados: inputBusca e busca

2. **Modal de rejeição**: Substituído Alert.prompt inexistente
   - Modal customizado com TextInput multiline
   - Validação de motivo obrigatório
   - Botões Cancelar e Rejeitar

3. **Layout de botões**: Corrigido posicionamento
   - Removido position: absolute dos botões
   - Agrupados em actionsContainer por status
   - Pendente: Aprovar + Rejeitar
   - Aprovado: Pausar/Ativar + Excluir
   - Rejeitado: Excluir

## ✨ Próximos Passos

Após validar todos os testes:

1. **Integração com Usuários Finais:**
   - Implementar resgate de cupom pelo app do usuário
   - Validação de QR code
   - Histórico de cupons resgatados

2. **Upload de Imagens:**
   - Adicionar campo de imagem no formulário
   - Integrar Cloudinary/AWS S3
   - Preview de imagem no card

3. **Estatísticas Avançadas:**
   - Dashboard de cupons
   - Gráficos de conversão
   - Cupons mais populares

4. **Notificações:**
   - Push quando cupom aprovado/rejeitado
   - Alertas de cupons próximos do vencimento
   - Notificar usuários sobre novos cupons

## 🎉 Conclusão

O Sistema de Cupons está 100% funcional com:
- ✅ Backend completo (Model, Controller, Routes)
- ✅ Frontend completo (Service, Navegação, Telas)
- ✅ CRUD completo
- ✅ Workflow de aprovação/rejeição
- ✅ Filtros e busca otimizada
- ✅ Validações robustas
- ✅ UX consistente com o design system
- ✅ Modal customizado de rejeição
- ✅ Botões condicionais por status
- ✅ Deployed e testado em produção

**Sprint 2 (Semanas 3-4): Sistema de Cupons - CONCLUÍDO! 🎊**

### Commits de Deploy
```bash
# Backend fixes
fix(cupom): remover next() dos middlewares pre-save
fix(negocio): remover index 2dsphere do campo coordinates

# Frontend improvements
fix(cupom): corrigir posicionamento dos botões de ação nos cards aprovados
feat(cupom): ajustar barra de busca para seguir padrão da tela de pontos
fix(cupom): corrigir botão de rejeição que não funcionava
feat(cupom): adicionar opção de excluir cupons rejeitados
```

### Testes Realizados
- ✅ Criação de cupom via Insomnia (API direta)
- ✅ Criação via app mobile
- ✅ Aprovação de cupom
- ✅ Rejeição com motivo obrigatório
- ✅ Edição de cupom
- ✅ Pausar/ativar cupom
- ✅ Exclusão de cupom aprovado
- ✅ Exclusão de cupom rejeitado
- ✅ Busca com botão e Enter
- ✅ Filtros (Ativos, Pausados, Expirados)
- ✅ Pull-to-refresh
- ✅ Paginação
- ✅ Validações de formulário

**Data de conclusão**: 9 de janeiro de 2026
**Status**: Pronto para produção ✨
