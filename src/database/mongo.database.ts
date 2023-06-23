import { MongooseModule } from '@nestjs/mongoose';

export default MongooseModule.forRoot(
  'mongodb://root:admin@localhost:27017/messages',
);
