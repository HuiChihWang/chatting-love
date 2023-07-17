import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtToken } from '../auth/token.entity';

const getPostgresOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('POSTGRES_DATABASE_HOST');
  const port = configService.get<number>('POSTGRES_DATABASE_PORT');
  const username = configService.get<string>('POSTGRES_DATABASE_USERNAME');
  const password = configService.get<string>('POSTGRES_DATABASE_PASSWORD');
  const database = configService.get<string>('POSTGRES_DATABASE_NAME');

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [User, JwtToken],
    synchronize: true,
  };
};
const PostgresModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: getPostgresOptions,
});

export default PostgresModule;
