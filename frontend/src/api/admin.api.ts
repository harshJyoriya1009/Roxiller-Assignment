import apiClient from './client';
import {
  CreateStoreRequest,
  CreateUserRequest,
  DashboardStats,
  SortConfig,
  Store,
  StoreFilters,
  User,
  UserDetails,
  UserFilters,
} from '../types';

type UserListParams = UserFilters & Partial<SortConfig>;
type StoreListParams = StoreFilters & Partial<SortConfig>;

export const adminApi = {
  getDashboard: () => apiClient.get<DashboardStats>('/admin/dashboard'),
  createUser: (data: CreateUserRequest) => apiClient.post<User>('/admin/users', data),
  createStore: (data: CreateStoreRequest) => apiClient.post<Store>('/admin/stores', data),
  getUsers: (params?: UserListParams) => apiClient.get<User[]>('/admin/users', { params }),
  getStores: (params?: StoreListParams) => apiClient.get<Store[]>('/admin/stores', { params }),
  getUserDetails: (id: string) => apiClient.get<UserDetails>(`/admin/users/${id}`),
};
