import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/log.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  getLogin(@Body() loginDto: LoginDto) {
    return this.authService.doLogin(loginDto);
  }
}
