import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({
  name: 'jwt_tokens',
})
export class JwtToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  refreshToken: string;

  @Column({
    nullable: false,
    unique: true,
  })
  accessToken: string;

  @Column({
    nullable: false,
  })
  expiredAt: Date;

  @OneToOne(() => User, (user) => user.token)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // TODO: hash token
  // @BeforeInsert()
  // @BeforeUpdate()
  // async encodePassword() {
  //   if (this.password) {
  //     this.password = await bcrypt.hash(this.password, 10);
  //   }
  // }
}
