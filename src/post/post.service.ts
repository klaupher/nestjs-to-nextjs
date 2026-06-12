import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateSlugFromText } from '../common/utils/create-slug-from-text';
import { generateRandomSuffix } from '../common/utils/generate-random-suffix';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async treatSlugEq(slug: string) {
    const postSlug = await this.postRepository.findOneBy({ slug });
    if (postSlug) {
      return `${slug}-${generateRandomSuffix()}`;
    }
    return slug;
  }

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: {
        author: true,
      },
    });
    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: { ...postData, author: { id: author.id } },
      relations: {
        author: true,
      },
    });
    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async findAllOwned(author: User) {
    const post = await this.postRepository.find({
      where: { author: { id: author.id } },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });
    return post;
  }

  async findAll(postData: Partial<Post>) {
    const post = await this.postRepository.find({
      where: postData,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });
    return post;
  }

  async create(dtoCreate: CreatePostDto, author: User) {
    const slug = await this.treatSlugEq(CreateSlugFromText(dtoCreate.title));
    const post = this.postRepository.create({
      title: dtoCreate.title,
      excerpt: dtoCreate.excerpt,
      content: dtoCreate.content,
      coverImageUrl: dtoCreate.coverImageUrl,
      slug,
      author,
    });
    const created = await this.postRepository.save(post).catch((e: unknown) => {
      if (e instanceof Error) {
        this.logger.error('Erro ao criar post', e.stack);
      }
      throw new BadRequestException('Erro ao criar o post');
    });
    return created;
  }

  async update(
    postData: Partial<Post>,
    dtoUpdate: UpdatePostDto,
    author: User,
  ) {
    if (Object.keys(dtoUpdate).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }
    const post = await this.findOneOwnedOrFail(postData, author);

    if (post) {
      post.title = dtoUpdate.title ?? post.title;
      post.content = dtoUpdate.content ?? post.content;
      post.excerpt = dtoUpdate.excerpt ?? post.excerpt;
      post.coverImageUrl = dtoUpdate.coverImageUrl ?? post.coverImageUrl;
      post.published = dtoUpdate.published ?? post.published;
    }

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });
    return post;
  }
}
