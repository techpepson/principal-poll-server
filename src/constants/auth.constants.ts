import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConstantsService {
  constructor(private config: ConfigService) {}
  jwtConstants() {
    return this.config.get('JWT_SECRET');
  }
}
