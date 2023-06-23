import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  firstName: string;

  @Column({
    length: 50,
  })
  lastName: string;

  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    unique: true,
  })
  email: string;

  @Column({
    length: 50,
  })
  password: string;
}
