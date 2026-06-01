import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ensureDefaultAdmin } from './seed-default-admin';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  await ensureDefaultAdmin(usersService);

  await app.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
