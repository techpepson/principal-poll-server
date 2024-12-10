/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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

  @Post('nominate-nominee')
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
      message: 'Nomination successful',
      nominee: createNomination,
    };
  }

  @Get('approve-nominee')
  @UseGuards(JwtGuard)
  async approveNominee(
    @Req() req: Request,
    @Query('nominee-code') nomineeCode: string,
  ) {
    const adminEmail = (req.user as any).userEmail;

    //check if the user is logged in
    if (!adminEmail) {
      return { message: ' Admin not found' };
    }

    //invoke the approve nominee method
    const approveNominee = await this.userService.approveNominee(
      adminEmail,
      nomineeCode,
    );

    //return the approved nominee to the client
    return {
      approveNominee,
    };
  }

  //remove user
  @Get('remove-nominee')
  @UseGuards(JwtGuard)
  async removeNominee(
    @Req() req: Request,
    @Query('nominee-code') nomineeCode: string,
  ) {
    const admin = (req.user as any).userEmail;

    //check if the user is logged in
    if (!admin) {
      return { message: ' Admin not found' };
    }

    //invoke the remove nominee method
    const approveNominee = await this.userService.removeNominee(
      admin,
      nomineeCode,
    );

    //return the removed nominee to the client
    return {
      approveNominee,
    };
  }

  //edit account

  //fetch nominees controller
  @Get('get-nomination-nominees')
  @UseGuards(JwtGuard)
  async fetchNominationNominees(
    @Req() req: Request,
    @Query('nomination-id') param: string,
  ) {
    //get the user email from jwt signing

    const admin = (req.user as any).userEmail;

    const nominationId = param;

    //check if the email is present
    if (!admin) {
      return { message: 'Admin email not found' };
    }

    //invoke the readAllNominations function
    const getNominationNominees =
      await this.userService.readAllNominationNominees(nominationId, admin);

    //return the nominations to the client
    return {
      nominees: getNominationNominees,
      message: getNominationNominees.message,
    };
  }

  //edit user account
  @Post('edit-account')
  @UseGuards(JwtGuard)
  async editAccount(@Req() req: Request, @Body() payload: any) {
    const email = await (req.user as any).userEmail;

    //instantiate the edit account class
    const accountEdit = await this.userService.editAccount(email, payload);

    return {
      message: accountEdit.message,
    };
  }

  //get nominations controller
  @Get('get-nominations')
  @UseGuards(JwtGuard)
  async fetchNominations(
    @Req() req: Request,
    @Query('take-value') param: number,
  ) {
    //get the user email from jwt signing

    const admin = (req.user as any).userEmail;

    const takeValue = param;

    //check if the email is present
    if (!admin) {
      return { message: 'Admin email not found' };
    }

    //invoke the readAllNominations function
    const getNominationNominees = await this.userService.readAllNominations(
      takeValue,
      admin,
    );

    //return the nominations to the client
    return {
      nominees: getNominationNominees,
      message: 'Nominees returned successfully',
      length: getNominationNominees.length,
    };
  }

  //delete account
  @Get('delete-account')
  @UseGuards(JwtGuard)
  async deleteAccount(@Req() req: Request) {
    const email = await (req.user as any).userEmail;

    //instantiate the delete account class
    const accountDelete = await this.userService.deleteAccount(email);

    //return a message to the client
    return {
      message: accountDelete.message,
    };
  }
}
