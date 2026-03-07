import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/modules/roles/entities/permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { PermissionRepository } from 'src/modules/roles/repositories/permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RolesController],
  providers: [RolesService, RoleRepository, PermissionRepository],
  exports: [RoleRepository, PermissionRepository],
})
export class RolesModule {}
