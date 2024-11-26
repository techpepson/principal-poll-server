import { Module } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.dto.service';
import { UserOnboardDto } from './user.dto.service';
import { NomineesDto } from './user.dto.service';

@Module({
  controllers: [],
  providers: [RegisterDto, NomineesDto, LoginDto, UserOnboardDto],
  exports: [RegisterDto, LoginDto, UserOnboardDto, NomineesDto],
})
export class DtoModule {}
