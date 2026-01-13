import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface LoginData {
  email: string;
  senha: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  dataDeNascimento?: string;
  pais?: string;
  cidade?: string;
}

interface UpdateUserData {
  nome?: string;
  email?: string;
  dataDeNascimento?: string;
  pais?: string;
  cidade?: string;
  fotoPerfil?: string;
}

interface AuthResponse {
  usuario: {
    _id: string;
    nome: string;
    email: string;
    dataDeNascimento?: string;
    pais?: string;
    cidade?: string;
    fotoPerfil?: string;
  };
  token: string;
}

const TOKEN_KEY = '@borali:token';
const USER_KEY = '@borali:user';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/usuarios/login', data);
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/usuarios/cadastro', data);
    await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    return response.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }
    return false;
  },

  async updateUser(data: UpdateUserData): Promise<any> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.put('/usuarios/atualizar', data);
    
    // Atualiza o usuário no AsyncStorage
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
    
    return response.data.usuario;
  },
};

export default authService;
