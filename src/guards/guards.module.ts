import { Global, Module } from '@nestjs/common';
import { JwtGuard } from './jwt.service';

@Global()
@Module({
  providers: [JwtGuard],
  exports: [JwtGuard],
})
export class GuardsModule {}
