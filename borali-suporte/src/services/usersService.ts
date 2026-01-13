import api from './api';

export interface User {
  _id?: string;
  nome: string;
  email: string;
  fotoPerfil?: string;
  pais?: string;
  cidade?: string;
  dataDeNascimento?: Date | string;
  pontos: number;
  nivel: number;
  ativo: boolean;
  banido: boolean;
  motivoBanimento?: string;
  dataBanimento?: Date | string;
  ultimoAcesso?: Date | string;
  totalCheckIns: number;
  totalCuponsResgatados: number;
  totalAvaliacoes: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  busca?: string;
  banido?: boolean;
  ativo?: boolean;
  ordenar?: string;
}

export interface UserListResponse {
  status: string;
  usuarios: User[];
  paginacao: {
    total: number;
    pagina: number;
    limite: number;
    totalPaginas: number;
  };
}

export interface UserDetailsResponse {
  status: string;
  usuario: User;
}

export interface UserStatistics {
  resumo: {
    totalUsuarios: number;
    usuariosAtivos: number;
    usuariosBanidos: number;
    usuariosInativos: number;
    usuariosRecentes: number;
  };
  gamificacao: {
    totalPontos: number;
    totalCheckIns: number;
    totalCuponsResgatados: number;
  };
  topUsuarios: Array<{
    _id: string;
    nome: string;
    fotoPerfil?: string;
    pontos: number;
    nivel: number;
  }>;
}

export interface StatisticsResponse {
  status: string;
  estatisticas: UserStatistics;
}

class UsersService {
  /**
   * Listar usuários com filtros
   */
  async listar(filtros: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());
    if (filtros.busca) params.append('busca', filtros.busca);
    if (filtros.banido !== undefined) params.append('banido', filtros.banido.toString());
    if (filtros.ativo !== undefined) params.append('ativo', filtros.ativo.toString());
    if (filtros.ordenar) params.append('ordenar', filtros.ordenar);

    const response = await api.get(`/usuarios?${params.toString()}`);
    return response.data;
  }

  /**
   * Buscar usuário por ID
   */
  async buscarPorId(id: string): Promise<UserDetailsResponse> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }

  /**
   * Banir usuário
   */
  async banir(id: string, motivo: string): Promise<UserDetailsResponse> {
    const response = await api.patch(`/usuarios/${id}/banir`, { motivo });
    return response.data;
  }

  /**
   * Desbanir usuário
   */
  async desbanir(id: string): Promise<UserDetailsResponse> {
    const response = await api.patch(`/usuarios/${id}/desbanir`);
    return response.data;
  }

  /**
   * Deletar usuário permanentemente
   */
  async deletar(id: string): Promise<{ status: string; mensagem: string }> {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }

  /**
   * Obter estatísticas gerais
   */
  async estatisticas(): Promise<StatisticsResponse> {
    const response = await api.get('/usuarios/estatisticas');
    return response.data;
  }
}

export const usersService = new UsersService();
