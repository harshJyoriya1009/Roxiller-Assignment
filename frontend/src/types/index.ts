export type UserRole = 'admin' | 'user' | 'store_owner';
export type SortOrder = 'ASC' | 'DESC';

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt?: string;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId?: string;
  averageRating: number;
  totalRatings: number;
  userRating?: number | null;
  userRatingId?: string | null;
  createdAt?: string;
}

export interface Rating {
  id: string;
  value: number;
  userId: string;
  storeId: string;
  userName?: string;
  userEmail?: string;
  submittedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  store: Store;
  averageRating: number;
  totalRatings: number;
  raters: Rating[];
}

export interface SortConfig {
  sortBy: string;
  sortOrder: SortOrder;
}

export interface AuthUser extends User {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest extends RegisterRequest {
  role: UserRole;
}

export interface CreateStoreRequest {
  name: string;
  email: string;
  address: string;
  ownerId?: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole | '';
}

export interface StoreFilters {
  name?: string;
  address?: string;
}

export interface UserDetails extends User {
  store?: Store;
}

export interface RatingSubmissionRequest {
  storeId: string;
  value: number;
}

export interface RatingUpdateRequest {
  value: number;
}
