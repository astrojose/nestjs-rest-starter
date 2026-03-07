import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123!' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ example: 'NewPass456!' })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({ example: 'NewPass456!' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
