import { NomineeService } from './nominee.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { NomineeController } from './nominee.votes.controller';
import { HttpModule } from '@nestjs/axios';
import { PaystackService } from 'src/payments/paystack.service';

@Module({
  imports: [HttpModule],
  controllers: [NomineeController],
  providers: [NomineeService, PaystackService],
})
export class NomineeModule {}
