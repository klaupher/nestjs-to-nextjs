import { Controller, Get, Param } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custon-parse-int-pipe..pipe';

@Controller('user')
export class UserController {
  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    return `Olá do controller de User #${id}`;
  }
}
