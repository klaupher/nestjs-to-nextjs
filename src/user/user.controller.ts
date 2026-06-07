import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custon-parse-int-pipe..pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    return `Olá do controller de User #${id}`;
  }

  @Post()
  create(@Body() dtoCreate: CreateUserDto) {
    return this.userService.create(dtoCreate);
  }
}
