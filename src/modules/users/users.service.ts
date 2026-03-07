import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import type { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { LoggerService } from 'src/lib/logger/logger.service';
import type { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { RoleRepository } from 'src/modules/roles/repositories/role.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const role = createUserDto.roleId
      ? await this.roleRepository.findById(createUserDto.roleId)
      : null;
    const user = await this.userRepository.save({
      ...createUserDto,
      role,
    });
    this.logger.log(`User created with id: ${user.id}`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll({
      relations: ['role', 'role.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findByIdWithRole(id);
    if (!user) {
      throw new NotFoundException(`User not found with id: ${id}`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findByIdWithRole(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existing = await this.findOne(id);
    const role =
      updateUserDto.roleId !== undefined
        ? await this.roleRepository.findById(updateUserDto.roleId)
        : existing.role;

    const updated = await this.userRepository.save({
      ...existing,
      ...updateUserDto,
      role,
    });
    this.logger.log(`User updated with id: ${id}`);
    return updated;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const deleted = await this.userRepository.deleteById(id);
    return { deleted };
  }

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = newPassword;
    return this.userRepository.save(user);
  }

  async resetPassword(userId: number, token: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = token;
    return this.userRepository.save(user);
  }
}
