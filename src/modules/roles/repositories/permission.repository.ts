import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Permission } from 'src/modules/roles/entities/permission.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({ where: { name } });
  }

  async findByNames(names: string[]): Promise<Permission[]> {
    if (!names.length) {
      return [];
    }

    return this.permissionRepository.find({
      where: { name: In(names) },
    });
  }

  create(data: Partial<Permission>): Permission {
    return this.permissionRepository.create(data);
  }
}
