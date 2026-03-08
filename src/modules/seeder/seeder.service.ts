import { Injectable } from '@nestjs/common';
import { Role } from 'src/modules/roles/entities/role.entity';
import { predefinedPermissions } from 'src/modules/seeder/data/permissions.data';
import { LoggerService } from 'src/lib/logger/logger.service';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';
import { PermissionRepository } from 'src/modules/roles/repositories/permission.repository';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class SeederService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async seed() {
    await Promise.all([this.#createRoles(), this.#createUsers()]);
  }

  async #createRoles() {
    this.logger.log('Creating roles...');
    const predefinedRoles = [
      {
        name: 'Admin',
        permissions: predefinedPermissions.Admin,
      },
      {
        name: 'Manager',
        permissions: predefinedPermissions.Manager,
      },
    ];

    await Promise.all(
      predefinedRoles.map(async roleData => {
        const roleExists = await this.roleRepository.findByName(roleData.name);

        if (!roleExists) {
          const role = new Role();
          role.name = roleData.name;
          role.permissions = await Promise.all(
            roleData.permissions.map(async permData => {
              let permission = await this.permissionRepository.findByName(
                permData.name,
              );
              if (!permission) {
                permission = await this.permissionRepository.save(
                  this.permissionRepository.create(permData),
                );
              }
              return permission;
            }),
          );
          await this.roleRepository.save(role);
        }
      }),
    );
  }

  async #createUsers() {
    this.logger.log('Creating users...');
    const roles = await this.roleRepository.findByNames(['Admin', 'Manager']);
    const roleMap = roles.reduce<Record<string, Role>>((map, role) => {
      map[role.name] = role;
      return map;
    }, {});

    const users = [
      {
        fullName: 'Admin User',
        phoneNumber: '1234567890',
        email: 'admin@example.com',
        password: 'Admin@1234!',
        role: roleMap['Admin'] ?? null,
      },
      {
        fullName: 'Manager User',
        phoneNumber: '0987654321',
        email: 'manager@example.com',
        password: 'Manager@1234!',
        role: roleMap['Manager'] ?? null,
      },
    ];

    await Promise.all(
      users.map(async userData => {
        const userExists = await this.userRepository.findByPhoneOrEmail(
          userData.phoneNumber,
          userData.email,
        );

        if (!userExists) {
          await this.userRepository.save(userData);
        } else {
          userExists.mergeData(userData);
          await this.userRepository.save(userExists);
        }
      }),
    );
  }
}
