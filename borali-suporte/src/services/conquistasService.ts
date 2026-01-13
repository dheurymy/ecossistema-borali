import api from './api';

// Interfaces
export interface Conquista {
  _id: string;
  titulo: string;
  descricao: string;
  icone: string;
  tipo: 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante';
  categoria: 'checkins' | 'avaliacoes' | 'cupons' | 'album' | 'social' | 'especial';
  condicao: {
    tipo: 'quantidade' | 'sequencia' | 'primeiro' | 'especial';
    meta?: number;
    descricao?: string;
  };
  recompensa: {
    pontos: number;
    bonus?: string;
  };
  imagem?: string;
  ativo: boolean;
  ordem: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConquistaFormData {
  titulo: string;
  descricao: string;
  icone: string;
  tipo: string;
  categoria: string;
  condicao: {
    tipo: string;
    meta?: number;
    descricao?: string;
  };
  recompensa: {
    pontos: number;
    bonus?: string;
  };
  imagem?: string;
  ativo: boolean;
  ordem: number;
}

export interface ConquistaFilters {
  tipo?: string;
  categoria?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

export interface ConquistaListResponse {
  conquistas: Conquista[];
  totalPaginas: number;
  paginaAtual: number;
  total: number;
}

export interface EstatisticasConquistas {
  total: number;
  ativas: number;
  inativas: number;
  porTipo: Array<{ _id: string; total: number }>;
  porCategoria: Array<{ _id: string; total: number }>;
}

const conquistasService = {
  // Listar conquistas com filtros
  async listar(filtros: ConquistaFilters = {}): Promise<ConquistaListResponse> {
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    
    const response = await api.get(`/conquistas?${params.toString()}`);
    return response.data;
  },

  // Buscar conquista por ID
  async buscarPorId(id: string): Promise<Conquista> {
    const response = await api.get(`/conquistas/${id}`);
    return response.data;
  },

  // Criar nova conquista
  async criar(dados: ConquistaFormData): Promise<{ mensagem: string; conquista: Conquista }> {
    const response = await api.post('/conquistas', dados);
    return response.data;
  },

  // Atualizar conquista
  async atualizar(id: string, dados: Partial<ConquistaFormData>): Promise<{ mensagem: string; conquista: Conquista }> {
    const response = await api.put(`/conquistas/${id}`, dados);
    return response.data;
  },

  // Deletar conquista
  async deletar(id: string): Promise<{ mensagem: string }> {
    const response = await api.delete(`/conquistas/${id}`);
    return response.data;
  },

  // Alternar status ativo/inativo
  async alternarStatus(id: string): Promise<{ mensagem: string; conquista: Conquista }> {
    const response = await api.patch(`/conquistas/${id}/status`);
    return response.data;
  },

  // Buscar estatísticas
  async estatisticas(): Promise<EstatisticasConquistas> {
    const response = await api.get('/conquistas/estatisticas');
    return response.data;
  }
};

export default conquistasService;
