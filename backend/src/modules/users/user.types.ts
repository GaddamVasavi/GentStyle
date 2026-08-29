export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string | Date;
}

export interface AdminUserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'CUSTOMER' | 'ADMIN';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
