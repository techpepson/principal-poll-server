import { Module } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto.service';

@Module({
  controllers: [],
  providers: [RegisterDto, LoginDto],
  exports: [RegisterDto, LoginDto],
})
export class DtoModule {}
