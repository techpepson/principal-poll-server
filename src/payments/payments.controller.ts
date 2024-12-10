/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { CreateRecipientDto, InitializeTransferDto } from 'src/dto/payment.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private payment: PaystackService) {}

  @Post('create-recipient')
  async createRecipient(
    @Body() payload: CreateRecipientDto,
    @Req() req: Request,
  ) {
    //extract admin email from the jwt token
    const email = (req.user as any).userEmail;
    payload.adminEmail = email;

    //invoke the createRecipient method
    const createRecipient = await this.payment.createRecipient(payload);

    //return the response to the client
    return {
      recipient: createRecipient.data,
    };
  }

  //initialize payment
  @Post('payment-initialize')
  async initPayment(@Body() payload: any) {
    const email = payload.email;
  }

  //initialize transfer recipient
  @Post('initialize-transfer-recipient')
  async initializeTransferPayment(
    @Body() payload: InitializeTransferDto,
    @Req() req: Request,
  ) {
    //extract admin email from the jwt token
    const email = (req.user as any).userEmail;
    payload.adminEmail = email;

    //invoke the createRecipient method
    const initializePayment =
      await this.payment.initializeTransferPayment(payload);

    //return the response to the client
    return {
      recipient: initializePayment.data,
    };
  }
}
