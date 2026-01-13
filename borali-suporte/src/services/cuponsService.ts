import api from './api';
import { authService } from './authService';

export interface Cupom {
  _id?: string;
  titulo: string;
  descricao: string;
  negocio: {
    _id: string;
    nome: string;
    categoria?: string;
    logo?: string;
    cidade?: string;
  } | string;
  tipo: 'percentual' | 'valor_fixo' | 'brinde' | 'outro';
  valorDesconto?: number;
  percentualDesconto?: number;
  codigo: string;
  dataInicio: string | Date;
  dataFim: string | Date;
  limiteResgates?: number | null;
  totalResgates?: number;
  regras?: string;
  restricoes?: {
    valorMinimo?: number;
    primeiraCompra?: boolean;
    diasSemana?: number[];
    horarioInicio?: string;
    horarioFim?: string;
  };
  statusCupom?: 'ativo' | 'pausado' | 'expirado' | 'esgotado';
  statusAprovacao?: 'pendente' | 'aprovado' | 'rejeitado';
  motivoRejeicao?: string;
  aprovadoPor?: any;
  dataAprovacao?: string;
  imagem?: string;
  destaque?: boolean;
  visualizacoes?: number;
  cliques?: number;
  disponivel?: boolean;
  taxaConversao?: string;
  taxaUtilizacao?: string;
  ativo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListaCuponsResponse {
  cupons: Cupom[];
  paginacao: {
    total: number;
    pagina: number;
    totalPaginas: number;
    itensPorPagina: number;
  };
}

export interface EstatisticasCupons {
  resumo: {
    total: number;
    ativos: number;
    pausados: number;
    expirados: number;
    pendentes: number;
    totalResgates: number;
  };
  porTipo: Array<{ _id: string; total: number }>;
  porNegocio: Array<{ _id: string; nome: string; total: number; totalResgates: number }>;
  maisResgatados: Cupom[];
}

class CuponsService {
  async listar(filtros?: any): Promise<ListaCuponsResponse> {
    const token = await authService.getToken();
    const response = await api.get('/cupons', {
      headers: { Authorization: `Bearer ${token}` },
      params: filtros,
    });
    return response.data;
  }

  async buscarPorId(id: string): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.get(`/cupons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.cupom;
  }

  async criar(dados: Partial<Cupom>): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.post('/cupons', dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.cupom;
  }

  async atualizar(id: string, dados: Partial<Cupom>): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.put(`/cupons/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.cupom;
  }

  async deletar(id: string): Promise<void> {
    const token = await authService.getToken();
    await api.delete(`/cupons/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async aprovar(id: string): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.patch(`/cupons/${id}/aprovar`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.cupom;
  }

  async rejeitar(id: string, motivoRejeicao: string): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.patch(
      `/cupons/${id}/rejeitar`,
      { motivoRejeicao },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.cupom;
  }

  async alternarStatus(id: string): Promise<Cupom> {
    const token = await authService.getToken();
    const response = await api.patch(`/cupons/${id}/status`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.cupom;
  }

  async registrarClique(id: string): Promise<void> {
    const token = await authService.getToken();
    await api.patch(`/cupons/${id}/clique`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async obterEstatisticas(negocioId?: string): Promise<EstatisticasCupons> {
    const token = await authService.getToken();
    const params = negocioId ? { negocio: negocioId } : {};
    const response = await api.get('/cupons/estatisticas', {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  }
}

export const cuponsService = new CuponsService();
