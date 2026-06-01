import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<LoginResponse>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post('/auth/register', data),
  getProfile: () => apiClient.get<User>('/auth/me'),
};
