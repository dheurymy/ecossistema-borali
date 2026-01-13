import api from './api';
import { authService } from './authService';

export interface Negocio {
  _id?: string;
  nome: string;
  razaoSocial?: string;
  cnpj?: string;
  categoria: string;
  descricao: string;
  localizacao: {
    endereco: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    estado?: string;
    cep?: string;
    latitude: number;
    longitude: number;
  };
  contato: {
    telefone: string;
    whatsapp?: string;
    email: string;
    site?: string;
    instagram?: string;
    facebook?: string;
  };
  horarioFuncionamento?: any;
  logo?: string;
  fotos?: string[];
  fotoCapa?: string;
  faixaPreco?: string;
  formasPagamento?: string[];
  aceitaReserva?: boolean;
  plano?: string;
  statusAssinatura?: string;
  statusCadastro?: string;
  valorMensalidade?: number;
  visualizacoes?: number;
  cliques?: number;
  cuponsResgatados?: number;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  ativo?: boolean;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListaNegociosResponse {
  negocios: Negocio[];
  paginacao: {
    total: number;
    pagina: number;
    totalPaginas: number;
    itensPorPagina: number;
  };
}

export interface EstatisticasNegocios {
  resumo: {
    total: number;
    mrr: string;
    arr: string;
  };
  porStatus: Array<{ _id: string; total: number }>;
  porPlano: Array<{ _id: string; total: number }>;
  porCategoria: Array<{ _id: string; total: number }>;
  porCidade: Array<{ _id: string; total: number }>;
}

class NegociosService {
  async listar(filtros?: any): Promise<ListaNegociosResponse> {
    const token = await authService.getToken();
    const response = await api.get('/negocios', {
      headers: { Authorization: `Bearer ${token}` },
      params: filtros,
    });
    return response.data;
  }

  async buscarPorId(id: string): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.get(`/negocios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.negocio;
  }

  async criar(dados: Partial<Negocio>): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.post('/negocios', dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.negocio;
  }

  async atualizar(id: string, dados: Partial<Negocio>): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.put(`/negocios/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.negocio;
  }

  async deletar(id: string): Promise<void> {
    const token = await authService.getToken();
    await api.delete(`/negocios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async aprovar(id: string): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.patch(`/negocios/${id}/aprovar`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.negocio;
  }

  async rejeitar(id: string, motivo: string): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.patch(`/negocios/${id}/rejeitar`, 
      { motivoRejeicao: motivo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.negocio;
  }

  async atualizarStatusAssinatura(id: string, status: string): Promise<Negocio> {
    const token = await authService.getToken();
    const response = await api.patch(`/negocios/${id}/assinatura`,
      { statusAssinatura: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.negocio;
  }

  async obterEstatisticas(): Promise<EstatisticasNegocios> {
    const token = await authService.getToken();
    const response = await api.get('/negocios/estatisticas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async buscarProximos(latitude: number, longitude: number, raio = 50000) {
    const token = await authService.getToken();
    const response = await api.get('/negocios/proximos', {
      headers: { Authorization: `Bearer ${token}` },
      params: { latitude, longitude, raio },
    });
    return response.data;
  }
}

export const negociosService = new NegociosService();
