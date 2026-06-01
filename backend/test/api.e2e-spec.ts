import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/users/user.entity';

interface AuthResponseBody {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

interface RegisterResponseBody {
  id: string;
  email: string;
  role: UserRole;
}

interface UserListItem {
  id: string;
}

interface StoreListItem {
  id: string;
  userRating: number | null;
}

interface StoreOwnerDashboardBody {
  totalRatings: number;
  averageRating: number;
}

describe('Store Rating API (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
    server = app.getHttpServer() as Parameters<typeof request>[0];

    usersService = app.get(UsersService);

    try {
      await usersService.create({
        name: 'System Administrator Account',
        email: 'admin@storerating.com',
        password: 'Admin@1234',
        address: '123 Admin Street, System City',
        role: UserRole.ADMIN,
      });
    } catch {
      // Admin already exists in the local test database.
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('supports register, admin management, rating, and store-owner dashboard', async () => {
    const stamp = Date.now();
    const userEmail = `e2e-user-${stamp}@example.com`;
    const ownerEmail = `e2e-owner-${stamp}@example.com`;
    const storeEmail = `e2e-store-${stamp}@example.com`;

    const adminLogin: Response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'admin@storerating.com',
        password: 'Admin@1234',
      })
      .expect(201);

    const adminBody = adminLogin.body as AuthResponseBody;
    const adminToken = adminBody.access_token;

    const registerResponse: Response = await request(server)
      .post('/api/auth/register')
      .send({
        name: `Normal User Account ${stamp}`,
        email: userEmail,
        password: 'User@1234',
        address: '123 Test Lane, Sample City',
      })
      .expect(201);

    const registeredUser = registerResponse.body as RegisterResponseBody;
    expect(registeredUser.email).toBe(userEmail);
    expect(registeredUser.role).toBe(UserRole.USER);

    const createOwnerResponse: Response = await request(server)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Store Owner Account ${stamp}`,
        email: ownerEmail,
        password: 'Owner@1234',
        address: '456 Owner Street, Sample City',
        role: UserRole.STORE_OWNER,
      })
      .expect(201);

    const ownerId = (createOwnerResponse.body as RegisterResponseBody).id;

    const createStoreResponse: Response = await request(server)
      .post('/api/admin/stores')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Primary Store Branch ${stamp}`,
        email: storeEmail,
        address: '789 Market Road, Sample City',
        ownerId,
      })
      .expect(201);

    const storeId = (createStoreResponse.body as { id: string }).id;

    await request(server)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ role: UserRole.STORE_OWNER })
      .expect(200)
      .expect(({ body }) => {
        const users = body as UserListItem[];
        expect(Array.isArray(users)).toBe(true);
        expect(users.some((user) => user.id === ownerId)).toBe(true);
      });

    const userLogin: Response = await request(server)
      .post('/api/auth/login')
      .send({
        email: userEmail,
        password: 'User@1234',
      })
      .expect(201);

    const userToken = (userLogin.body as AuthResponseBody).access_token;

    await request(server)
      .post('/api/ratings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ storeId, value: 5 })
      .expect(201);

    await request(server)
      .get('/api/stores')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ name: 'Primary Store Branch' })
      .expect(200)
      .expect(({ body }) => {
        const stores = body as StoreListItem[];
        const store = stores.find((item) => item.id === storeId);
        expect(store?.userRating).toBe(5);
      });

    const ownerLogin: Response = await request(server)
      .post('/api/auth/login')
      .send({
        email: ownerEmail,
        password: 'Owner@1234',
      })
      .expect(201);

    await request(server)
      .get('/api/store-owner/dashboard')
      .set(
        'Authorization',
        `Bearer ${(ownerLogin.body as AuthResponseBody).access_token}`,
      )
      .expect(200)
      .expect(({ body }) => {
        const dashboard = body as StoreOwnerDashboardBody;
        expect(dashboard.totalRatings).toBe(1);
        expect(dashboard.averageRating).toBe(5);
      });
  });
});
