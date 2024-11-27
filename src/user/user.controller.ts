/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { NominationsDto, UserOnboardDto } from 'src/dto/user.dto.service';
import { JwtGuard } from 'src/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('onboard')
  async onboardUser(
    @Body() payload: UserOnboardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    //extract the user email from the login request
    const email = (req.user as any).userEmail;

    if (!email) {
      return { message: 'Email extraction failed.' };
    }

    //instantiate the onboard service
    const userOnboard = await this.userService.onboardUser(email, payload);

    if (userOnboard.redirectUrl) {
      // Manually set the redirect URL and status code
      return res.redirect(307, 'https://www.google.com');
    }

    //return the user to the client

    return {
      userOnboard,
      success: true,
    };
  }

  @Post('nominateNominee')
  @UseGuards(JwtGuard)
  async addNominee(@Body() payload: NominationsDto, @Req() req: Request) {
    const user = (req.user as any).userEmail;

    if (!user) {
      return { message: 'Email not found' };
    }

    //invoke the add nomination method
    const createNomination = await this.userService.nominateUser(user, payload);

    //return the created nomination to the client
    return {
      nominee: createNomination,
    };
  }

  @Post('approveNominee')
  async approveNominee(@Req() req: Request, @Param('id') nomineeId: string) {
    const admin = (req.user as any).userEmail;

    //check if the user is logged in
    if (!admin) {
      return { message: ' Admin not found' };
    }

    //get  the id from the param
    const id = nomineeId;

    //invoke the approve nominee method
    const approveNominee = await this.userService.approveNominee(admin, id);

    //return the approved nominee to the client
    return {
      approveNominee,
    };
  }

  //remove user
  @Post('approveNominee')
  async removeNominee(@Req() req: Request, @Param('id') nomineeId: string) {
    const admin = (req.user as any).userEmail;

    //check if the user is logged in
    if (!admin) {
      return { message: ' Admin not found' };
    }

    //get  the id from the param
    const id = nomineeId;

    //invoke the remove nominee method
    const approveNominee = await this.userService.removeNominee(admin, id);

    //return the removed nominee to the client
    return {
      approveNominee,
    };
  }
}
