/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateRecipientDto,
  InitializeTransferDto,
  PaymentDto,
} from 'src/dto/payment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaystackService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}
  logger = new Logger('PaystackService');

  //method for initializing payment
  async initializePayment(payload: PaymentDto) {
    //check if payload is present
    if (!payload) {
      throw new BadRequestException('The required payload was not provided');
    }

    const paystackUrl = 'https://api.paystack.co/transaction/initialize';

    //convert amount properly
    const convertedAmount = payload.amount * 100;

    //initialize payment
    try {
      const response = await axios.post(
        paystackUrl,
        {
          email: payload.email,
          amount: convertedAmount,
          currency: 'GHS',
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.get('PAYSTACK_LIVE_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return { data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          'Paystack API error:',
          error.response?.data || error.message,
        );
        throw new InternalServerErrorException(
          'There was an error processing your payment',
        );
      }
      this.logger.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //verify payment method
  async verifyPayment(reference: string) {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.config.get('PAYSTACK_LIVE_SECRET_KEY')}`,
        },
      });

      return { data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          'Paystack API error:',
          error.response?.data || error.message,
        );
        throw new InternalServerErrorException(
          'There was an error processing your payment',
        );
      }
      this.logger.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  //create recipient
  async createRecipient(payload: CreateRecipientDto) {
    //check the admin role
    const admin = await this.prisma.user.findUnique({
      where: {
        email: payload.adminEmail,
      },
      select: {
        role: true,
      },
    });

    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    const paystackUrl = 'https://api.paystack.co/transferrecipient';

    const response = await axios.post(
      paystackUrl,
      {
        type: 'mobile_money',
        name: payload.recipientName,
        currency: 'GHS',
        phone: payload.phoneNumber,
        bank_code: payload.network,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.get('PAYSTACK_LIVE_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    );

    //store the recipient code in a database
    await this.prisma.user.update({
      where: {
        email: payload.adminEmail,
      },
      data: {
        recipientCode: response.data.recipient_code,
      },
    });

    //return the created recipient to the client
    return {
      data: response.data,
    };
  }

  //payment transfer
  async initializeTransferPayment(payload: InitializeTransferDto) {
    const admin = await this.prisma.user.findUnique({
      where: {
        email: payload.adminEmail,
      },
      select: {
        role: true,
        recipientCode: true,
      },
    });

    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    const paystackUrl = 'https://api.paystack.co/transfer';

    //make a post request to transfer funds
    const response = await axios.post(
      paystackUrl,
      {
        source: 'balance',
        reason: payload.reason,
        amount: payload.amount,
        recipient: admin.recipientCode,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.get('PAYSTACK_LIVE_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    );

    //store the transfer code
    await this.prisma.user.update({
      where: {
        email: payload.adminEmail,
      },
      data: {
        transferCode: response.data.transfer_code,
      },
    });

    //return the response
    return {
      data: response.data,
    };
  }
  //finalize transfer
  async finalizePayment(otp: string, adminEmail) {
    const admin = await this.prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
      select: {
        role: true,
        transferCode: true,
      },
    });

    //check for role
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    const paystackUrl = 'https://api.paystack.co/transfer/finalize_transfer';

    const response = await axios.post(
      paystackUrl,
      {
        transfer_code: admin.transferCode,
        otp,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.get('PAYSTACK_LIVE_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    );

    //return response
    return {
      data: response.data,
    };
  }
}
