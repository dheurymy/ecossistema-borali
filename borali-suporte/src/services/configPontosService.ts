import api from './api';

// Interfaces
export interface ConfiguracaoPontos {
  _id: string;
  ativo: boolean;
  acoes: {
    checkin: {
      pontos: number;
      limiteDiario: number;
      bonusSequencia: {
        ativo: boolean;
        dias: number;
        pontos: number;
      };
    };
    avaliacao: {
      pontos: number;
      limiteDiario: number;
    };
    resgateCupom: {
      pontos: number;
      semLimite: boolean;
    };
    compartilhamento: {
      pontos: number;
      limiteDiario: number;
    };
    primeiraVisita: {
      pontos: number;
    };
    conquistaAlbum: {
      comum: number;
      incomum: number;
      rara: number;
      epica: number;
      lendaria: number;
    };
    completarMissao: {
      diaria: number;
      semanal: number;
      mensal: number;
    };
  };
  niveis: {
    pontosProximoNivel: 'linear' | 'exponencial' | 'customizado';
    baseLinear: number;
    baseExponencial: number;
    niveisCustomizados: Array<{
      nivel: number;
      pontosNecessarios: number;
      titulo?: string;
      icone?: string;
    }>;
  };
  geral: {
    pontosPorReal: number;
    maxPontosDesconto: number;
  };
  versao: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulacaoPontos {
  acao: string;
  quantidade: number;
  quantidadeEfetiva: number;
  pontosPorAcao: number;
  totalPontos: number;
  limiteDiario: number | null;
  atingiuLimite: boolean;
}

export interface CalculoNivel {
  nivelAtual: number;
  proximoNivel: number;
  pontosNecessarios: number;
}

const configPontosService = {
  // Buscar configuração ativa
  async buscarAtiva(): Promise<ConfiguracaoPontos> {
    const response = await api.get('/config-pontos');
    return response.data;
  },

  // Atualizar configuração
  async atualizar(dados: Partial<ConfiguracaoPontos>): Promise<{ mensagem: string; config: ConfiguracaoPontos }> {
    const response = await api.put('/config-pontos', dados);
    return response.data;
  },

  // Calcular pontos para próximo nível
  async calcularProximoNivel(nivelAtual: number): Promise<CalculoNivel> {
    const response = await api.get(`/config-pontos/nivel/${nivelAtual}`);
    return response.data;
  },

  // Simular ganho de pontos
  async simularPontos(acao: string, quantidade: number = 1): Promise<SimulacaoPontos> {
    const response = await api.post('/config-pontos/simular', { acao, quantidade });
    return response.data;
  },

  // Histórico de versões
  async historico(): Promise<Array<{ versao: number; createdAt: string; updatedAt: string }>> {
    const response = await api.get('/config-pontos/historico');
    return response.data;
  }
};

export default configPontosService;
