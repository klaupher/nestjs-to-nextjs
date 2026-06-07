import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'Email é Obrgatória' })
  email: string | undefined;

  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  password: string | undefined;
}
