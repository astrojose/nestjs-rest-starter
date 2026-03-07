import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Role } from 'src/modules/roles/entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return this.roleRepository.find({
      where: { name: In(names) },
      relations: ['permissions'],
    });
  }

  async findOneWithPermissions(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }
}
