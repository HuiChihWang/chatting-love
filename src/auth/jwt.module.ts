import { JwtModule } from '@nestjs/jwt';

const JwtAuthModule = JwtModule.register({
  global: true,
  secret: 'secret',
  signOptions: { expiresIn: '1h' },
});

export default JwtAuthModule;
