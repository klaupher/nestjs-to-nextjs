import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/log.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';
import { HashingService } from '../common/hashing/hashing.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async doLogin(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email!);
    const error = new UnauthorizedException('Usuário ou senha inválida');
    if (!user) {
      throw error;
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password!,
      user.password,
    );
    if (!isPasswordValid) {
      throw error;
    }

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    user.forceLogout = false;
    await this.userService.save(user);

    return { accessToken };
  }
}
