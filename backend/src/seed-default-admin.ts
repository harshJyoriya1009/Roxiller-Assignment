import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

export async function ensureDefaultAdmin(usersService: UsersService) {
  const existingAdmin = await usersService.findByEmail('admin@storerating.com');
  if (existingAdmin) {
    console.log('Admin already exists, skipping seed');
    return;
  }

  await usersService.create({
    name: 'System Administrator Account',
    email: 'admin@storerating.com',
    password: 'Admin@1234',
    address: '123 Admin Street, System City',
    role: UserRole.ADMIN,
  });

  console.log('Default admin created: admin@storerating.com');
}
