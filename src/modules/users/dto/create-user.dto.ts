import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user.',
    example: 'Tachera Sasi',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address of the user.',
    example: 'tachera@ekilie.com',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'Password for the user account. Will be hashed before saving.',
    example: 'tachisgreat!',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @ApiProperty({
    description: 'ID of the role assigned to the user.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number;
}
