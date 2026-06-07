import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'src/common/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dtoCreate: CreateUserDto) {
    // Email precisa ser único
    const exists = await this.userRepository.exists({
      where: {
        email: dtoCreate.email,
      },
    });

    if (exists) {
      throw new ConflictException('E-mail já existe!');
    }

    // Precisa fazer hash da senha
    const hashedPassword = await this.hashingService.hash(dtoCreate?.password!);
    const newUser: CreateUserDto = {
      name: dtoCreate.name!,
      email: dtoCreate.email!,
      password: hashedPassword,
    };
    // Salvar na base de dados
    const created = await this.userRepository.save(newUser);
    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
