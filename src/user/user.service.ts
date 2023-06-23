import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequest } from './user.request';

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
        username: username,
      },
    });
  }
}
