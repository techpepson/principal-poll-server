import { ConstantsModule } from './constants/constants.module';
import { DtoModule } from './dto/dto.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OnboardModule } from './onboard/onboard.module';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [
    ConstantsModule,
    DtoModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    OnboardModule,
    GuardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
