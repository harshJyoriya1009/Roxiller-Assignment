import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Rating } from '../ratings/rating.entity';
import { User } from '../users/user.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  address!: string;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  owner!: User;

  @Column({ nullable: true })
  ownerId!: string;

  @OneToMany(() => Rating, (rating) => rating.store)
  ratings!: Rating[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
