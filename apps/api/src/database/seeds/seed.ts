import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

dotenv.config();
import { Role, RoleType } from '../../app/roles/role.entity';
import { Permission } from '../../app/permissions/permission.entity';
import { Organization } from '../../app/organizations/organization.entity';
import { User } from '../../app/users/user.entity';
import { Task, TaskStatus, TaskPriority } from '../../app/tasks/task.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'turbovets',
    entities: [Role, Permission, Organization, User, Task],
    synchronize: true,
    ssl: process.env.DB_HOST?.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : false,
  });

  await dataSource.initialize();
  console.log('🌱 Starting database seed...\n');

  // ====================================
  // 1. Create Permissions
  // ====================================
  console.log('📋 Creating permissions...');
  const permissionsData = [
    { name: 'view_tasks', description: 'Can view tasks' },
    { name: 'create_tasks', description: 'Can create tasks' },
    { name: 'update_tasks', description: 'Can update tasks' },
    { name: 'delete_tasks', description: 'Can delete tasks' },
    { name: 'view_users', description: 'Can view users' },
    { name: 'create_users', description: 'Can create users' },
    { name: 'update_users', description: 'Can update users' },
    { name: 'delete_users', description: 'Can delete users' },
    { name: 'manage_roles', description: 'Can manage roles and permissions' },
  ];

  const permissions = [];
  for (const permData of permissionsData) {
    const permission = await dataSource.getRepository(Permission).save(permData);
    permissions.push(permission);
    console.log(`  ✓ Created permission: ${permission.name}`);
  }

  // ====================================
  // 2. Create Roles with Permissions
  // ====================================
  console.log('\n👥 Creating roles...');

  // Owner - All permissions
  const ownerRole = await dataSource.getRepository(Role).save({
    name: RoleType.OWNER,
    description: 'Full system access',
    permissions: permissions,
  });
  console.log(`  ✓ Created role: ${ownerRole.name} (${permissions.length} permissions)`);

  // Admin - Most permissions except manage_roles
  const adminPermissions = permissions.filter(p => p.name !== 'manage_roles' && p.name !== 'delete_users');
  const adminRole = await dataSource.getRepository(Role).save({
    name: RoleType.ADMIN,
    description: 'Can create and update resources',
    permissions: adminPermissions,
  });
  console.log(`  ✓ Created role: ${adminRole.name} (${adminPermissions.length} permissions)`);

  // Viewer - Only view permissions
  const viewerPermissions = permissions.filter(p => p.name.startsWith('view_'));
  const viewerRole = await dataSource.getRepository(Role).save({
    name: RoleType.VIEWER,
    description: 'Read-only access',
    permissions: viewerPermissions,
  });
  console.log(`  ✓ Created role: ${viewerRole.name} (${viewerPermissions.length} permissions)`);

  // ====================================
  // 3. Create Organizations
  // ====================================
  console.log('\n🏢 Creating organizations...');

  const org1 = await dataSource.getRepository(Organization).save({
    name: 'Acme Corporation',
    description: 'Test organization 1',
  });
  console.log(`  ✓ Created org: ${org1.name} (${org1.id})`);

  const org2 = await dataSource.getRepository(Organization).save({
    name: 'TechCorp Industries',
    description: 'Test organization 2',
  });
  console.log(`  ✓ Created org: ${org2.name} (${org2.id})`);

  // ====================================
  // 4. Create Users
  // ====================================
  console.log('\n👤 Creating users...');

  const defaultPassword = await bcrypt.hash('password123', 10);

  const ownerUser = await dataSource.getRepository(User).save({
    email: 'owner@acme.com',
    name: 'Alice Owner',
    password: defaultPassword,
    organizationId: org1.id,
    roleId: ownerRole.id,
  });
  console.log(`  ✓ Created user: ${ownerUser.name} (${ownerUser.email}) - Role: Owner`);

  const adminUser = await dataSource.getRepository(User).save({
    email: 'admin@acme.com',
    name: 'Bob Admin',
    password: defaultPassword,
    organizationId: org1.id,
    roleId: adminRole.id,
  });
  console.log(`  ✓ Created user: ${adminUser.name} (${adminUser.email}) - Role: Admin`);

  const viewerUser = await dataSource.getRepository(User).save({
    email: 'viewer@acme.com',
    name: 'Charlie Viewer',
    password: defaultPassword,
    organizationId: org1.id,
    roleId: viewerRole.id,
  });
  console.log(`  ✓ Created user: ${viewerUser.name} (${viewerUser.email}) - Role: Viewer`);

  const org2User = await dataSource.getRepository(User).save({
    email: 'admin@techcorp.com',
    name: 'Diana TechCorp',
    password: defaultPassword,
    organizationId: org2.id,
    roleId: adminRole.id,
  });
  console.log(`  ✓ Created user: ${org2User.name} (${org2User.email}) - Role: Admin`);

  // ====================================
  // 5. Create Tasks
  // ====================================
  console.log('\n📝 Creating tasks...');

  const task1 = await dataSource.getRepository(Task).save({
    title: 'Setup development environment',
    description: 'Install all necessary tools and dependencies',
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    organizationId: org1.id,
    assigneeId: ownerUser.id,
  });
  console.log(`  ✓ Created task: ${task1.title}`);

  const task2 = await dataSource.getRepository(Task).save({
    title: 'Implement user authentication',
    description: 'Add JWT authentication to the API',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    organizationId: org1.id,
    assigneeId: adminUser.id,
  });
  console.log(`  ✓ Created task: ${task2.title}`);

  const task3 = await dataSource.getRepository(Task).save({
    title: 'Write API documentation',
    description: 'Document all endpoints with examples',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    organizationId: org1.id,
    assigneeId: viewerUser.id,
  });
  console.log(`  ✓ Created task: ${task3.title}`);

  const task4 = await dataSource.getRepository(Task).save({
    title: 'Deploy to production',
    description: 'Set up CI/CD pipeline and deploy',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    organizationId: org2.id,
    assigneeId: org2User.id,
  });
  console.log(`  ✓ Created task: ${task4.title}`);

  // ====================================
  // Summary
  // ====================================
  console.log('\n✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`  - ${permissions.length} permissions`);
  console.log(`  - 3 roles (Owner, Admin, Viewer)`);
  console.log(`  - 2 organizations`);
  console.log(`  - 4 users`);
  console.log(`  - 4 tasks`);
  console.log('\n🔑 Test Users (all passwords: password123):');
  console.log(`  Owner:  ${ownerUser.email}`);
  console.log(`  Admin:  ${adminUser.email}`);
  console.log(`  Viewer: ${viewerUser.email}`);
  console.log(`  Org2:   ${org2User.email}`);
  console.log('\n💡 Use POST /auth/login with email and password to get JWT token!\n');

  await dataSource.destroy();
}

seed()
  .then(() => {
    console.log('🎉 Seeding finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
