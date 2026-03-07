import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'NewPass123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'NewPass123!' })
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
