import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/roles/entities/role.entity';
import { PermissionResponseDto } from './permission.response.dto';

export class RoleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Admin' })
  name: string;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  updatedAt: Date;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.permissions = (role.permissions ?? []).map(
      p => new PermissionResponseDto(p),
    );
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}
