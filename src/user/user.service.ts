import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../common/hashing/hashing.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({
      email,
    });

    if (exists) {
      throw new ConflictException('E-mail já existe!');
    }
  }

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async create(dtoCreate: CreateUserDto) {
    // Email precisa ser único
    await this.failIfEmailExists(dtoCreate.email!);

    // Precisa fazer hash da senha
    const newUser: CreateUserDto = {
      name: dtoCreate.name,
      email: dtoCreate.email!,
      password: await this.hashingService.hash(dtoCreate.password!),
    };
    // Salvar na base de dados
    const created = await this.userRepository.save(newUser);
    return created;
  }

  async update(id: string, dtoUpdate: UpdateUserDto) {
    if (!dtoUpdate.name && !dtoUpdate.email) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.findOneByOrFail({ id });
    user.name = dtoUpdate.name ?? user.name;
    if (dtoUpdate.email && dtoUpdate.email !== user.email) {
      await this.failIfEmailExists(dtoUpdate.email);
      user.email = dtoUpdate.email;
      user.forceLogout = true;
    }
    return this.userRepository.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });
    const isCurrentPasswordValue = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValue) {
      throw new UnauthorizedException('Senha atual inválida');
    }
    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
