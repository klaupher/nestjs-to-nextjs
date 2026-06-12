import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types/authenticated-request';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dtoCreate: CreateUserDto) {
    const user = await this.userService.create(dtoCreate);
    return new ResponseUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() dtoCreate: UpdateUserDto,
  ) {
    const user = await this.userService.update(req.user.id, dtoCreate);
    return new ResponseUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dtoPass: UpdatePasswordDto,
  ) {
    const user = await this.userService.updatePassword(req.user.id, dtoPass);
    return new ResponseUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findOneByOrFail({ id: req.user.id });
    return new ResponseUserDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.remove(req.user.id);
    return new ResponseUserDto(user);
  }
}
