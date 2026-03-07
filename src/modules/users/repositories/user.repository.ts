import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });
  }

  async findByPhoneOrEmail(
    phoneNumber: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email }, { phoneNumber }],
      relations: ['role'],
    });
  }

  async findByIdWithRole(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
  }
}
