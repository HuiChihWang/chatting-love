import { MongooseModule } from '@nestjs/mongoose';

const MongoModule = MongooseModule.forRoot(
  'mongodb://root:admin@localhost:27017/messages',
);
export default MongoModule;
