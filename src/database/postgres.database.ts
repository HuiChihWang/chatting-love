import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

export default TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'admin',
  database: 'user_database',
  entities: [User],
  synchronize: true,
});
