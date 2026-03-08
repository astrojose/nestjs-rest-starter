import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/modules/roles/entities/permission.entity';

export class PermissionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'users:read' })
  name: string;

  constructor(permission: Permission) {
    this.id = permission.id;
    this.name = permission.name;
  }
}
