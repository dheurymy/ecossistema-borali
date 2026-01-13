import api from './api';

// Interfaces
export interface Missao {
  _id: string;
  titulo: string;
  descricao: string;
  tipo: 'diaria' | 'semanal' | 'mensal' | 'especial';
  categoria: 'checkin' | 'avaliacao' | 'cupom' | 'social' | 'exploracao' | 'outro';
  acao: {
    tipo: 'fazer_checkin' | 'avaliar_negocio' | 'resgatar_cupom' | 'visitar_ponto' | 'compartilhar' | 'outro';
    meta: number;
    parametros?: Record<string, any>;
  };
  recompensa: {
    pontos: number;
    extra?: string;
  };
  icone: string;
  cor: string;
  validade: {
    inicio: string;
    fim: string;
  };
  repeticao: 'unica' | 'diaria' | 'semanal' | 'mensal';
  ativo: boolean;
  destaque: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MissaoFormData {
  titulo: string;
  descricao: string;
  tipo: string;
  categoria: string;
  acao: {
    tipo: string;
    meta: number;
    parametros?: Record<string, any>;
  };
  recompensa: {
    pontos: number;
    extra?: string;
  };
  icone: string;
  cor: string;
  validade: {
    inicio: string;
    fim: string;
  };
  repeticao: string;
  ativo: boolean;
  destaque: boolean;
}

export interface MissaoFilters {
  tipo?: string;
  categoria?: string;
  ativo?: boolean;
  validas?: boolean;
  page?: number;
  limit?: number;
}

export interface MissaoListResponse {
  missoes: Missao[];
  totalPaginas: number;
  paginaAtual: number;
  total: number;
}

export interface EstatisticasMissoes {
  total: number;
  ativas: number;
  inativas: number;
  validas: number;
  expiradas: number;
  porTipo: Array<{ _id: string; total: number }>;
  porCategoria: Array<{ _id: string; total: number }>;
}

const missoesService = {
  // Listar missões com filtros
  async listar(filtros: MissaoFilters = {}): Promise<MissaoListResponse> {
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
    if (filtros.validas !== undefined) params.append('validas', filtros.validas.toString());
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    
    const response = await api.get(`/missoes?${params.toString()}`);
    return response.data;
  },

  // Buscar missão por ID
  async buscarPorId(id: string): Promise<Missao> {
    const response = await api.get(`/missoes/${id}`);
    return response.data;
  },

  // Criar nova missão
  async criar(dados: MissaoFormData): Promise<{ mensagem: string; missao: Missao }> {
    const response = await api.post('/missoes', dados);
    return response.data;
  },

  // Atualizar missão
  async atualizar(id: string, dados: Partial<MissaoFormData>): Promise<{ mensagem: string; missao: Missao }> {
    const response = await api.put(`/missoes/${id}`, dados);
    return response.data;
  },

  // Deletar missão
  async deletar(id: string): Promise<{ mensagem: string }> {
    const response = await api.delete(`/missoes/${id}`);
    return response.data;
  },

  // Alternar status ativo/inativo
  async alternarStatus(id: string): Promise<{ mensagem: string; missao: Missao }> {
    const response = await api.patch(`/missoes/${id}/status`);
    return response.data;
  },

  // Alternar destaque
  async alternarDestaque(id: string): Promise<{ mensagem: string; missao: Missao }> {
    const response = await api.patch(`/missoes/${id}/destaque`);
    return response.data;
  },

  // Buscar estatísticas
  async estatisticas(): Promise<EstatisticasMissoes> {
    const response = await api.get('/missoes/estatisticas');
    return response.data;
  }
};

export default missoesService;
