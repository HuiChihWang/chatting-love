import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

const dbModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'admin',
  database: 'user_database',
  entities: [User],
  synchronize: true,
});

@Module({
  imports: [UserModule, AuthModule, dbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
