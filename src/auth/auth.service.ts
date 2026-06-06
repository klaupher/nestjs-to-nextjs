import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/log.dto';

@Injectable()
export class AuthService {
  getLogin(loginDto: LoginDto) {
    console.log(loginDto.email);
    console.log(loginDto.password);
    return loginDto;
  }
}
