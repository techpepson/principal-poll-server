/*
https://docs.nestjs.com/providers#services
*/

import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaystackService } from 'src/payments/paystack.service';

@Injectable()
export class NomineeService {
  constructor(
    private prisma: PrismaService,
    private payment: PaystackService,
  ) {}

  async initializePayment(
    nomineeCode: string,
    amount: number,
    voteQuantity: number,
    email: string,
  ) {
    const nominee = await this.prisma.nominees.findUnique({
      where: {
        nomineeCode,
      },
    });

    //throw an exception when the nominee is not found
    if (!nominee) {
      throw new NotFoundException('There nominee could not be found.');
    }

    //call the initialize paystack method
    const initPayload = {
      email,
      amount,
    };
    const initializePayment = await this.payment.initializePayment(initPayload);

    //save the temp amount and vote count in a database
    await this.prisma.nominees.update({
      where: {
        nomineeCode,
      },
      data: {
        tempAmount: amount,
        tempVotes: voteQuantity,
      },
    });

    //return the initializePayment return values to the client
    return {
      data: initializePayment.data,
    };
  }

  async finalizePayment(reference: any, nomineeCode: string) {
    const nominee = await this.prisma.nominees.findUnique({
      where: {
        nomineeCode,
      },
    });

    //check if the nominee exists
    if (!nominee) {
      throw new NotFoundException('Nominee not found');
    }

    //call the verify payment method
    const verifyPayment = await this.payment.verifyPayment(reference);

    //check if the payment status was a success
    if (verifyPayment.data.status !== 'success') {
      throw new BadGatewayException('Payment could not be finalized');
    }

    //get the temporal nominee data from the database
    const nomineeData = await this.prisma.nominees.findUnique({
      where: { nomineeCode },
      select: {
        tempAmount: true,
        tempVotes: true,
      },
    });

    //store the temporal nominee data if the payment is a success
    await this.prisma.nominees.update({
      where: {
        nomineeCode,
      },
      data: {
        nomineeAmount: nomineeData.tempAmount,
        nomineeVotes: nomineeData.tempVotes,
      },
    });

    //delete the temp values from the database
    await this.prisma.nominees.update({
      where: { nomineeCode },
      data: {
        tempAmount: null,
        tempVotes: null,
      },
    });

    return {
      data: verifyPayment.data,
      message: 'Voting successful',
    };
  }
}
