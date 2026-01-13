// Interfaces para Pontos de Interesse

export interface Localizacao {
  latitude: number;
  longitude: number;
  endereco?: string;
  cidade: string;
  estado?: string;
  pais: string;
}

export interface Foto {
  url: string;
  legenda?: string;
  principal?: boolean;
}

export interface InformacoesPraticas {
  horarioFuncionamento?: string;
  faixaPreco?: 'Gratuito' | '$' | '$$' | '$$$' | '$$$$';
  tempoMedioVisita?: string;
}

export interface Contato {
  telefone?: string;
  site?: string;
  redesSociais?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Acessibilidade {
  rampa?: boolean;
  banheiroAdaptado?: boolean;
  estacionamento?: boolean;
  audioGuia?: boolean;
}

export type CategoriaPonto = 
  | 'Restaurante'
  | 'Museu'
  | 'Parque'
  | 'Praia'
  | 'Monumento'
  | 'Hotel'
  | 'Aventura'
  | 'Cultura'
  | 'Natureza'
  | 'Compras'
  | 'Vida Noturna'
  | 'Outro';

export type StatusPonto = 'ativo' | 'inativo' | 'rascunho';

export interface PontoInteresse {
  _id?: string;
  nome: string;
  descricaoCurta: string;
  descricaoLonga: string;
  categoria: CategoriaPonto;
  tags?: string[];
  localizacao: Localizacao;
  fotos?: Foto[];
  fotoCapa?: string;
  informacoesPraticas?: InformacoesPraticas;
  contato?: Contato;
  acessibilidade?: Acessibilidade;
  status?: StatusPonto;
  visualizacoes?: number;
  avaliacaoMedia?: number;
  criadoPor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarPontoData {
  nome: string;
  descricaoCurta: string;
  descricaoLonga: string;
  categoria: CategoriaPonto;
  tags?: string[];
  localizacao: Localizacao;
  fotos?: Foto[];
  fotoCapa?: string;
  informacoesPraticas?: InformacoesPraticas;
  contato?: Contato;
  acessibilidade?: Acessibilidade;
  status?: StatusPonto;
}

export interface AtualizarPontoData extends Partial<CriarPontoData> {}

export interface FiltrosPontos {
  nome?: string;
  categoria?: CategoriaPonto;
  cidade?: string;
  estado?: string;
  pais?: string;
  status?: StatusPonto;
  busca?: string;
  page?: number;
  limit?: number;
  ordenar?: string;
}

export interface PaginacaoPontos {
  total: number;
  pagina: number;
  totalPaginas: number;
  itensPorPagina: number;
}

export interface ListaPontosResponse {
  pontos: PontoInteresse[];
  paginacao: PaginacaoPontos;
}

export interface EstatisticasPontos {
  resumo: {
    total: number;
    ativos: number;
    inativos: number;
    rascunhos: number;
  };
  porCategoria: Array<{ _id: string; total: number }>;
  porPais: Array<{ _id: string; total: number }>;
  maisVisualizados: PontoInteresse[];
}
