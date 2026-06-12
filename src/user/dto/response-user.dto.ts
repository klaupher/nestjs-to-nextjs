import { User } from '../entities/user.entity';

export class ResponseUserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(user: User | null) {
    this.id = user?.id ?? '';
    this.name = user?.name ?? '';
    this.email = user?.email ?? '';
    this.createdAt = user?.createdAt ?? new Date();
    this.updatedAt = user?.updatedAt ?? new Date();
  }
}
