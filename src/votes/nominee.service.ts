/*
https://docs.nestjs.com/providers#services
*/

import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaystackService } from 'src/payments/paystack.service';
import { FinalizePaymentDto, InitPaymentDto } from 'src/dto/payment.dto';

@Injectable()
export class NomineeService {
  constructor(
    private prisma: PrismaService,
    private payment: PaystackService,
  ) {}

  async initializePayment(initPaymentPayload: InitPaymentDto) {
    const nominee = await this.prisma.nominees.findUnique({
      where: {
        nomineeCode: initPaymentPayload.nomineeCode,
      },
    });

    //throw an exception when the nominee is not found
    if (!nominee) {
      throw new NotFoundException('There nominee could not be found.');
    }

    //call the initialize paystack method
    const initPayload = {
      email: initPaymentPayload.email,
      amount: initPaymentPayload.amount,
    };
    const initializePayment = await this.payment.initializePayment(initPayload);

    //save the temp amount and vote count in a database
    await this.prisma.nominees.update({
      where: {
        nomineeCode: initPaymentPayload.nomineeCode,
      },
      data: {
        tempAmount: initPaymentPayload.amount,
        tempVotes: initPaymentPayload.voteQuantity,
      },
    });

    //return the initializePayment return values to the client
    return {
      data: initializePayment.data,
    };
  }

  async finalizePayment(payload: FinalizePaymentDto) {
    const nominee = await this.prisma.nominees.findUnique({
      where: {
        nomineeCode: payload.nomineeCode,
      },
    });

    //check if the nominee exists
    if (!nominee) {
      throw new NotFoundException('Nominee not found');
    }

    //call the verify payment method
    const verifyPayment = await this.payment.verifyPayment(payload.reference);

    //check if the payment status was a success
    if (verifyPayment.data.status !== 'success') {
      throw new BadGatewayException('Payment could not be finalized');
    }

    //get the temporal nominee data from the database
    const nomineeData = await this.prisma.nominees.findUnique({
      where: { nomineeCode: payload.nomineeCode },
      select: {
        tempAmount: true,
        tempVotes: true,
        nomineeAmount: true,
        nomineeVotes: true,
      },
    });

    //increment value for nomineeAmount and nomineeVotes
    const incrementAmount = nomineeData.nomineeAmount + nomineeData.tempAmount;
    const incrementVotes = nomineeData.nomineeVotes + nomineeData.tempVotes;

    //store the temporal nominee data if the payment is a success
    await this.prisma.nominees.update({
      where: {
        nomineeCode: payload.nomineeCode,
      },
      data: {
        nomineeAmount: incrementAmount,
        nomineeVotes: incrementVotes,
      },
    });

    //delete the temp values from the database
    await this.prisma.nominees.update({
      where: { nomineeCode: payload.nomineeCode },
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

  //fetch the total amount an admin has earned
  async fetchTotalAmount(email: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        role: true,
      },
    });

    //check if the admin exists
    if (!admin) {
      throw new NotFoundException('The admin could not be found');
    }

    //check the role of the admin
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    //aggregate the nominees field

    const calculateTotalNomineeAmount = await this.prisma.nominees.aggregate({
      _sum: {
        nomineeAmount: true,
      },
      where: {
        nominations: {
          user: {
            email,
          },
        },
      },
      orderBy: {
        nomineeAmount: 'asc',
      },
    });

    //return the total amount to the client
    return {
      totalAmount: calculateTotalNomineeAmount._sum.nomineeAmount || 0,
    };
  }
}
