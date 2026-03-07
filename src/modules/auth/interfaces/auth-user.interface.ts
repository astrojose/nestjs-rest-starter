import type { Role } from 'src/modules/roles/entities/role.entity';

export interface AuthUser {
  userId: number;
  email: string;
  role: Role | null;
}
