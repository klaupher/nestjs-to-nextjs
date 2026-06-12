import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  excerpt!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  coverImageUrl!: string;

  // Many to One <= authorId <- Fk de User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author!: User;

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
