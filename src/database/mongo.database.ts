import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

const getMongooseOptions = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  const user = configService.get<string>('MONGO_DATABASE_USERNAME');
  const pass = configService.get<string>('MONGO_DATABASE_PASSWORD');

  const host = configService.get<string>('MONGO_DATABASE_HOST');
  const port = configService.get<number>('MONGO_DATABASE_PORT');
  const dbName = configService.get<string>('MONGO_DATABASE_NAME');
  const mongoUri = `mongodb://${host}:${port}`;

  return {
    user,
    pass,
    dbName,
    uri: mongoUri,
  };
};

const MongoModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: getMongooseOptions,
});
export default MongoModule;
