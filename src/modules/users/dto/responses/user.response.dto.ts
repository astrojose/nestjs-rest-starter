import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';
import { RoleResponseDto } from 'src/modules/roles/dto/responses/role.response.dto';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiPropertyOptional({ type: () => RoleResponseDto })
  role: RoleResponseDto | null;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.role = user.role ? new RoleResponseDto(user.role) : null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
