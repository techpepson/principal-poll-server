/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/dto';
import { AuthService } from 'src/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async createUser(@Body() registerPayload: RegisterDto) {
    const response = await this.authService.createUser(registerPayload);

    //return the user to the client
    return response;
  }

  @Post('login')
  async loginUser(@Body() login: LoginDto) {
    const loginService = await this.authService.loginUser(login);
    return loginService;
  }
}
