import { Alert } from 'react-native';

/**
 * Interface para erro padronizado
 */
export interface ErrorResponse {
  status?: string;
  mensagem: string;
  erro?: string;
  stack?: string;
}

/**
 * Tipos de erro categorizados
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Classe de erro categorizado
 */
export class CategorizedError {
  type: ErrorType;
  message: string;
  originalError?: any;

  constructor(type: ErrorType, message: string, originalError?: any) {
    this.type = type;
    this.message = message;
    this.originalError = originalError;
  }
}

/**
 * Serviço centralizado de tratamento de erros
 */
class ErrorService {
  /**
   * Categoriza e processa o erro
   */
  categorizeError(error: any): CategorizedError {
    // Erro de rede (sem conexão)
    if (!error.response && error.request) {
      return new CategorizedError(
        ErrorType.NETWORK,
        'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
        error
      );
    }

    // Erro com resposta do servidor
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Erro de autenticação
      if (status === 401) {
        return new CategorizedError(
          ErrorType.AUTH,
          data?.mensagem || 'Sessão expirada. Faça login novamente.',
          error
        );
      }

      // Erro de validação
      if (status === 400) {
        return new CategorizedError(
          ErrorType.VALIDATION,
          data?.mensagem || 'Dados inválidos. Verifique as informações e tente novamente.',
          error
        );
      }

      // Recurso não encontrado
      if (status === 404) {
        return new CategorizedError(
          ErrorType.NOT_FOUND,
          data?.mensagem || 'Recurso não encontrado.',
          error
        );
      }

      // Erro do servidor
      if (status >= 500) {
        return new CategorizedError(
          ErrorType.SERVER,
          'Erro no servidor. Tente novamente em alguns instantes.',
          error
        );
      }

      // Outros erros com mensagem do servidor
      return new CategorizedError(
        ErrorType.UNKNOWN,
        data?.mensagem || 'Ocorreu um erro. Tente novamente.',
        error
      );
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return new CategorizedError(
        ErrorType.NETWORK,
        'Tempo de espera excedido. Verifique sua conexão e tente novamente.',
        error
      );
    }

    // Erro desconhecido
    return new CategorizedError(
      ErrorType.UNKNOWN,
      error.message || 'Ocorreu um erro inesperado. Tente novamente.',
      error
    );
  }

  /**
   * Exibe alerta de erro formatado
   */
  showError(error: any, title: string = 'Erro') {
    const categorizedError = this.categorizeError(error);
    
    Alert.alert(title, categorizedError.message, [
      {
        text: 'OK',
        style: 'default',
      },
    ]);

    // Log para debug
    if (__DEV__) {
      console.error('Error Details:', {
        type: categorizedError.type,
        message: categorizedError.message,
        original: categorizedError.originalError,
      });
    }
  }

  /**
   * Exibe alerta de sucesso
   */
  showSuccess(message: string, title: string = 'Sucesso') {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'default',
      },
    ]);
  }

  /**
   * Exibe alerta de aviso
   */
  showWarning(message: string, title: string = 'Atenção') {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'default',
      },
    ]);
  }

  /**
   * Exibe alerta de confirmação
   */
  showConfirmation(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(title, message, [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
  }

  /**
   * Obtém mensagem amigável do erro
   */
  getErrorMessage(error: any): string {
    const categorizedError = this.categorizeError(error);
    return categorizedError.message;
  }

  /**
   * Verifica se é erro de autenticação
   */
  isAuthError(error: any): boolean {
    const categorizedError = this.categorizeError(error);
    return categorizedError.type === ErrorType.AUTH;
  }

  /**
   * Verifica se é erro de rede
   */
  isNetworkError(error: any): boolean {
    const categorizedError = this.categorizeError(error);
    return categorizedError.type === ErrorType.NETWORK;
  }
}

export const errorService = new ErrorService();
