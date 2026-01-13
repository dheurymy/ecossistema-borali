import api from './api';
import { authService } from './authService';
import {
  PontoInteresse,
  CriarPontoData,
  AtualizarPontoData,
  FiltrosPontos,
  ListaPontosResponse,
  EstatisticasPontos,
} from '../types/pontoInteresse';

class PontosService {
  // Listar pontos com filtros e paginação
  async listar(filtros?: FiltrosPontos): Promise<ListaPontosResponse> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      // Construir query params
      const params = new URLSearchParams();
      if (filtros?.nome) params.append('nome', filtros.nome);
      if (filtros?.categoria) params.append('categoria', filtros.categoria);
      if (filtros?.cidade) params.append('cidade', filtros.cidade);
      if (filtros?.estado) params.append('estado', filtros.estado);
      if (filtros?.pais) params.append('pais', filtros.pais);
      if (filtros?.status) params.append('status', filtros.status);
      if (filtros?.busca) params.append('busca', filtros.busca);
      if (filtros?.page) params.append('page', filtros.page.toString());
      if (filtros?.limit) params.append('limit', filtros.limit.toString());
      if (filtros?.ordenar) params.append('ordenar', filtros.ordenar);

      const queryString = params.toString();
      const url = queryString ? `/pontos?${queryString}` : '/pontos';

      const response = await api.get<ListaPontosResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar pontos:', error);
      throw error;
    }
  }

  // Buscar ponto por ID
  async buscarPorId(id: string): Promise<PontoInteresse> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await api.get<{ pontoInteresse: PontoInteresse }>(`/pontos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.pontoInteresse;
    } catch (error: any) {
      console.error('Erro ao buscar ponto:', error);
      throw error;
    }
  }

  // Criar novo ponto
  async criar(data: CriarPontoData): Promise<PontoInteresse> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await api.post<{ pontoInteresse: PontoInteresse }>(
        '/pontos',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.pontoInteresse;
    } catch (error: any) {
      console.error('Erro ao criar ponto:', error);
      throw error;
    }
  }

  // Atualizar ponto existente
  async atualizar(id: string, data: AtualizarPontoData): Promise<PontoInteresse> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await api.put<{ pontoInteresse: PontoInteresse }>(
        `/pontos/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.pontoInteresse;
    } catch (error: any) {
      console.error('Erro ao atualizar ponto:', error);
      throw error;
    }
  }

  // Deletar ponto
  async deletar(id: string): Promise<void> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      await api.delete(`/pontos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Erro ao deletar ponto:', error);
      throw error;
    }
  }

  // Obter estatísticas
  async estatisticas(): Promise<EstatisticasPontos> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const response = await api.get<EstatisticasPontos>('/pontos/estatisticas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Buscar pontos próximos
  async buscarProximos(latitude: number, longitude: number, raio: number = 50000): Promise<{
    pontos: PontoInteresse[];
    total: number;
    localizacaoUsuario: { latitude: number; longitude: number };
    raio: number;
  }> {
    try {
      const token = await authService.getToken();
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        raio: raio.toString(),
      });

      const response = await api.get(`/pontos/proximos?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar pontos próximos:', error);
      throw error;
    }
  }
}

export const pontosService = new PontosService();
