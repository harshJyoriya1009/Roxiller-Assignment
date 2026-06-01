"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultAdmin = ensureDefaultAdmin;
const user_entity_1 = require("./users/user.entity");
async function ensureDefaultAdmin(usersService) {
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
        role: user_entity_1.UserRole.ADMIN,
    });
    console.log('Default admin created: admin@storerating.com');
}
//# sourceMappingURL=seed-default-admin.js.map