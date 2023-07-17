import { IsNull, Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './user.request';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(request: CreateUserRequest) {
    const newUser = this.userRepository.create(request);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findUser(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findUserAndUpdate(
    userId: string,
    updatedFields: QueryDeepPartialEntity<User>,
  ) {
    const updatedResult = await this.userRepository.update(
      userId,
      updatedFields,
    );

    console.log(updatedResult);
  }
}
