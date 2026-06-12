import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'Email precisa ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string | undefined;

  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode ser vazia' })
  @MinLength(6, {
    message: 'Senha deve ser formada por no mínimo 6 caracteres!',
  })
  password: string | undefined;
}
