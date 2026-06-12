import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Titulo precisa ser uma string' })
  @Length(10, 150, { message: 'Titulo precisa ter entre 10 e 150 caracteres' })
  title!: string;

  @IsString({ message: 'Resumo precisa ser uma string' })
  @Length(10, 200, { message: 'Resumo precisa ter entre 10 e 200 caracteres' })
  excerpt!: string;

  @IsString({ message: 'Resumo precisa ser uma string' })
  @IsNotEmpty({ message: 'Resumo precisa ter entre 10 e 200 caracteres' })
  content!: string;

  @IsOptional() // vai ser requerido pelo Next.JS
  @IsUrl({ require_tld: false }) //Top Level domain proíbe localhost e IP
  coverImageUrl!: string;
}
