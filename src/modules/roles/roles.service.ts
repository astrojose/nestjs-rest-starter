import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import type { UpdateRoleDto } from 'src/modules/roles/dto/update-role.dto';
import { LoggerService } from 'src/lib/logger/logger.service';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { PermissionRepository } from 'src/modules/roles/repositories/permission.repository';
import { RoleResponseDto } from 'src/modules/roles/dto/responses/role.response.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = new Role();
    role.name = createRoleDto.name;

    if (createRoleDto.permissions?.length) {
      role.permissions = await this.resolvePermissions(
        createRoleDto.permissions,
      );
    }

    return new RoleResponseDto(await this.roleRepository.save(role));
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findAll({
      relations: ['permissions'],
    });
    return roles.map(r => new RoleResponseDto(r));
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOneWithPermissions(id);
    if (!role) {
      this.logger.error(`Role not found with id: ${id}`, '');
      throw new NotFoundException(`Role not found with id: ${id}`);
    }
    return new RoleResponseDto(role);
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findOneWithPermissions(id);
    if (!existingRole) {
      throw new NotFoundException(`Role not found with id: ${id}`);
    }
    const permissions =
      updateRoleDto.permissions !== undefined
        ? await this.resolvePermissions(updateRoleDto.permissions)
        : existingRole.permissions;

    const role = await this.roleRepository.save({
      ...existingRole,
      ...updateRoleDto,
      permissions,
    });
    this.logger.log(`Role updated with id: ${id}`);
    return new RoleResponseDto(role);
  }

  private async resolvePermissions(permissionNames: string[]) {
    const existingPermissions =
      await this.permissionRepository.findByNames(permissionNames);
    const existingPermissionNames = new Set(
      existingPermissions.map(permission => permission.name),
    );
    const missingPermissionNames = permissionNames.filter(
      permissionName => !existingPermissionNames.has(permissionName),
    );
    const createdPermissions = await Promise.all(
      missingPermissionNames.map(permissionName =>
        this.permissionRepository.save(
          this.permissionRepository.create({ name: permissionName }),
        ),
      ),
    );
    return [...existingPermissions, ...createdPermissions];
  }
}
