/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';

@Module({
  imports: [],
  providers: [PaystackService],
  exports: [PaystackService],
})
export class PaystackModule {}
