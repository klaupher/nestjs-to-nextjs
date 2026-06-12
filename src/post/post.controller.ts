import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedRequest } from '../auth/types/authenticated-request';
import { ResponsePostDto } from './dto/response-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dtoCreate: CreatePostDto,
  ) {
    const post = await this.postService.create(dtoCreate, req.user);
    return new ResponsePostDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dtoUpdate: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, dtoUpdate, req.user);
    return new ResponsePostDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postService.remove({ id }, req.user);
    return new ResponsePostDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user);
    return new ResponsePostDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOwned(req.user);
    return posts.map(post => new ResponsePostDto(post));
  }

  @Get()
  async findAllPublished() {
    const posts = await this.postService.findAll({ published: true });
    return posts.map(post => new ResponsePostDto(post));
  }

  @Get(':slug')
  async findOnePublished(
    @Req() req: AuthenticatedRequest,
    @Param('slug') slug: string,
  ) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    });
    return new ResponsePostDto(post);
  }
}
