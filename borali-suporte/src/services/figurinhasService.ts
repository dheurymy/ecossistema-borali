import api from './api';

// Interfaces
export interface Figurinha {
  _id: string;
  numero: number;
  nome: string;
  descricao?: string;
  pontoInteresse: {
    _id: string;
    nome: string;
    categoria: string;
    imagem?: string;
    localizacao?: {
      cidade?: string;
    };
  };
  categoria: 'comum' | 'incomum' | 'rara' | 'epica' | 'lendaria';
  serie: string;
  imagem: string;
  imagemMiniatura?: string;
  condicaoObtencao: {
    tipo: 'checkin' | 'primeira_visita' | 'visitas_multiplas' | 'evento_especial' | 'compra';
    meta?: number;
    descricao?: string;
  };
  pontuacao: number;
  ativo: boolean;
  lancamento: string;
  estatisticas: {
    totalObtida: number;
    totalTrocas: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FigurinhaFormData {
  numero: number;
  nome: string;
  descricao?: string;
  pontoInteresse: string;
  categoria: string;
  serie: string;
  imagem: string;
  imagemMiniatura?: string;
  condicaoObtencao: {
    tipo: string;
    meta?: number;
    descricao?: string;
  };
  pontuacao: number;
  ativo: boolean;
  lancamento: string;
}

export interface FigurinhaFilters {
  categoria?: string;
  serie?: string;
  ativo?: boolean;
  pontoInteresse?: string;
  page?: number;
  limit?: number;
}

export interface FigurinhaListResponse {
  figurinhas: Figurinha[];
  totalPaginas: number;
  paginaAtual: number;
  total: number;
}

export interface EstatisticasFigurinhas {
  total: number;
  ativas: number;
  inativas: number;
  porCategoria: Array<{ _id: string; total: number }>;
  porSerie: Array<{ _id: string; total: number }>;
  maisObtidas: Array<{
    numero: number;
    nome: string;
    categoria: string;
    estatisticas: { totalObtida: number };
  }>;
  maisRaras: Array<{
    numero: number;
    nome: string;
    categoria: string;
    estatisticas: { totalObtida: number };
  }>;
}

const figurinhasService = {
  // Listar figurinhas com filtros
  async listar(filtros: FigurinhaFilters = {}): Promise<FigurinhaListResponse> {
    const params = new URLSearchParams();
    
    if (filtros.categoria) params.append('categoria', filtros.categoria);
    if (filtros.serie) params.append('serie', filtros.serie);
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
    if (filtros.pontoInteresse) params.append('pontoInteresse', filtros.pontoInteresse);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    
    const response = await api.get(`/figurinhas?${params.toString()}`);
    return response.data;
  },

  // Buscar figurinha por ID
  async buscarPorId(id: string): Promise<Figurinha> {
    const response = await api.get(`/figurinhas/${id}`);
    return response.data;
  },

  // Buscar figurinha por número
  async buscarPorNumero(numero: number): Promise<Figurinha> {
    const response = await api.get(`/figurinhas/numero/${numero}`);
    return response.data;
  },

  // Criar nova figurinha
  async criar(dados: FigurinhaFormData): Promise<{ mensagem: string; figurinha: Figurinha }> {
    const response = await api.post('/figurinhas', dados);
    return response.data;
  },

  // Atualizar figurinha
  async atualizar(id: string, dados: Partial<FigurinhaFormData>): Promise<{ mensagem: string; figurinha: Figurinha }> {
    const response = await api.put(`/figurinhas/${id}`, dados);
    return response.data;
  },

  // Deletar figurinha
  async deletar(id: string): Promise<{ mensagem: string }> {
    const response = await api.delete(`/figurinhas/${id}`);
    return response.data;
  },

  // Alternar status ativo/inativo
  async alternarStatus(id: string): Promise<{ mensagem: string; figurinha: Figurinha }> {
    const response = await api.patch(`/figurinhas/${id}/status`);
    return response.data;
  },

  // Buscar estatísticas
  async estatisticas(): Promise<EstatisticasFigurinhas> {
    const response = await api.get('/figurinhas/estatisticas');
    return response.data;
  }
};

export default figurinhasService;
