import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { TasksModule } from './tasks/tasks.module';
import { RolesModule } from './roles/role.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { User, Organization, Task, Role, Permission, AuditLog } from '@turbovets/data';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'turbovets',
      entities: [User, Organization, Task, Role, Permission, AuditLog],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.DB_HOST?.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    TasksModule,
    RolesModule,
    PermissionsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
