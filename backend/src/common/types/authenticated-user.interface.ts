import { UserRole } from '../../users/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
