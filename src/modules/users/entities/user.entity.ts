import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';
import { BasicEntity } from 'src/common/entities/base.entity';
import * as crypto from 'crypto';

@Entity('users')
export class User extends BasicEntity {
  @Column({ length: 100, name: 'full_name' })
  fullName: string;

  @Column({ length: 100, name: 'phone_number' })
  phoneNumber: string;

  @Column({ length: 100, name: 'email', unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Role, role => role.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeInsertOrUpdate() {
    if (this.password && !this.password.includes(':')) {
      this.password = await this.#hashPassword(this.password);
    }
  }
  async #hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    const [salt, storedHash] = this.password.split(':');
    if (!salt || !storedHash) {
      return false;
    }

    return new Promise((resolve, reject) => {
      crypto.scrypt(candidatePassword, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(storedHash === derivedKey.toString('hex'));
      });
    });
  }
}
