/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { ConstantsService } from './auth.constants';

@Global()
@Module({
  controllers: [],
  providers: [ConstantsService],
  exports: [ConstantsService],
})
export class ConstantsModule {}
