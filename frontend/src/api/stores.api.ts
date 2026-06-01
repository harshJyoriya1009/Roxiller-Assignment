import apiClient from './client';
import {
  RatingSubmissionRequest,
  RatingUpdateRequest,
  Store,
  StoreFilters,
  StoreOwnerDashboard,
  UpdatePasswordRequest,
} from '../types';

export const storesApi = {
  getAll: (params?: StoreFilters) => apiClient.get<Store[]>('/stores', { params }),
  getOne: (id: string) => apiClient.get<Store>(`/stores/${id}`),
};

export const ratingsApi = {
  create: (data: RatingSubmissionRequest) => apiClient.post('/ratings', data),
  update: (id: string, data: RatingUpdateRequest) => apiClient.put(`/ratings/${id}`, data),
};

export const storeOwnerApi = {
  getDashboard: () => apiClient.get<StoreOwnerDashboard>('/store-owner/dashboard'),
};

export const usersApi = {
  updatePassword: (data: UpdatePasswordRequest) =>
    apiClient.put('/users/update-password', data),
};
