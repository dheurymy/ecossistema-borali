import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorService } from './errorService';

const API_URL = 'https://borali-api.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - adiciona token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@borali_admin:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta - trata erros globalmente
api.interceptors.response.use(
  (response) => {
    // Resposta bem-sucedida, apenas retorna
    return response;
  },
  async (error) => {
    // Log para debug
    if (__DEV__) {
      console.log('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Se for erro 401 (não autorizado), pode limpar token e redirecionar
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      await AsyncStorage.removeItem('@borali_admin:token');
      await AsyncStorage.removeItem('@borali_admin:user');
      // Nota: navegação será tratada nas telas individuais
    }

    // Rejeita com o erro para ser tratado nas chamadas específicas
    return Promise.reject(error);
  }
);

export default api;
