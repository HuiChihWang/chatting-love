import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { CacheModule } from './cache/cache.module';
import PostgresModule from './database/postgres.database';
import MongoModule from './database/mongo.database';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MessageModule,
    PostgresModule,
    MongoModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
