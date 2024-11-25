import { Module } from '@nestjs/common';
import { AuthController, AuthService } from '.';
import { JwtModule } from '@nestjs/jwt';
import { ConstantsModule } from 'src/constants/constants.module';
import { configDotenv } from 'dotenv';
import { JwtStrategy } from './Strategies/jwt.strategy';

configDotenv();

@Module({
  imports: [
    ConstantsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
