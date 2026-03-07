import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/modules/auth/decorator/public.decorator';

@ApiTags('Auth')
@ApiBearerAuth('JWT')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
