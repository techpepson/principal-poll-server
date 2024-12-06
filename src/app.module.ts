import { PaymentsController } from './payments/payments.controller';
import { PaystackModule } from './payments/paystack.module';
import { PaystackService } from './payments/paystack.service';
import { NomineeModule } from './votes/nominee.module';
import { NomineeController } from './votes/nominee.votes.controller';
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
import { NomineeService } from './votes/nominee.service';

@Module({
  imports: [
    PaystackModule,
    NomineeModule,
    ConstantsModule,
    DtoModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    OnboardModule,
    GuardsModule,
  ],
  controllers: [PaymentsController, NomineeController, AppController],
  providers: [PaystackService, AppService, NomineeService],
})
export class AppModule {}
