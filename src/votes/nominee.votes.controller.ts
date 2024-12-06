/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { NomineeService } from './nominee.service';
import { FinalizePaymentDto, InitPaymentDto } from 'src/dto/payment.dto';
import { Request } from 'express';

@Controller('nominee')
export class NomineeController {
  constructor(private votingService: NomineeService) {}

  @Post('initPayment/:nominee-code')
  async initializePayment(
    @Body() payload: InitPaymentDto,

    @Param('nominee-code') nomineeCode: string,
  ): Promise<any> {
    //get the nomineeCode from the params

    payload.nomineeCode = nomineeCode;

    const invokeInitMethod =
      await this.votingService.initializePayment(payload);

    //return the response to the client
    return {
      response: invokeInitMethod.data,
    };
  }

  @Get('finalizePayment/:nominee-code')
  async finalizePayment(
    @Body() payload: FinalizePaymentDto,
    @Param('nominee-code') nomineeCode: string,
    @Headers('reference') reference: string,
  ): Promise<any> {
    //extract the nomineeCode from the param
    payload.nomineeCode = nomineeCode;

    //extract the reference from the header
    payload.reference = reference;

    //invoke the finalize payment method
    const invokeFinalizeMethod =
      await this.votingService.finalizePayment(payload);

    //return the response to the client
    return {
      data: invokeFinalizeMethod.data,
      message: invokeFinalizeMethod.message,
    };
  }

  @Get('get-total-amount')
  async fetchAllAmounts(@Body() email: string, @Req() req: Request) {
    //fetch the admin email from the sign in request
    email = (req.user as any).userEmail;

    //instantiate the fetch all amount method
    const fetchAllAmount = await this.votingService.fetchTotalAmount(email);

    //return the amount to the client
    return {
      amount: fetchAllAmount.totalAmount,
    };
  }
}
