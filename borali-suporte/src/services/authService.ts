import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface Administrador {
  _id: string;
  nome: string;
  email: string;
  dataDeNascimento?: string;
  pais?: string;
  cidade?: string;
  funcao?: string;
  fotoPerfil?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  dataDeNascimento?: string;
  pais?: string;
  cidade?: string;
  funcao?: string;
}

export interface UpdateAdminData {
  nome?: string;
  email?: string;
  dataDeNascimento?: string;
  pais?: string;
  cidade?: string;
  funcao?: string;
  fotoPerfil?: string;
}

const ADMIN_TOKEN_KEY = '@borali_admin:token';
const ADMIN_USER_KEY = '@borali_admin:user';

export const authService = {
  async login(data: LoginData): Promise<{ admin: Administrador; token: string }> {
    const response = await api.post('/administradores/login', data);
    const { administrador, token } = response.data;
    
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
    await AsyncStorage.setItem(ADMIN_USER_KEY, JSON.stringify(administrador));
    
    return { admin: administrador, token };
  },

  async register(data: RegisterData): Promise<{ admin: Administrador; token: string }> {
    const response = await api.post('/administradores/cadastro', data);
    const { administrador, token } = response.data;
    
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
    await AsyncStorage.setItem(ADMIN_USER_KEY, JSON.stringify(administrador));
    
    return { admin: administrador, token };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(ADMIN_TOKEN_KEY);
    await AsyncStorage.removeItem(ADMIN_USER_KEY);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
  },

  async getUser(): Promise<Administrador | null> {
    const userString = await AsyncStorage.getItem(ADMIN_USER_KEY);
    return userString ? JSON.parse(userString) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  async updateAdmin(data: UpdateAdminData): Promise<Administrador> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.put('/administradores/atualizar', data);
    
    // Atualiza o administrador no AsyncStorage
    await AsyncStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.data.administrador));
    
    return response.data.administrador;
  },
};
