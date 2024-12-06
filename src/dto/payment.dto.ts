import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;
}

export class InitPaymentDto {
  @IsString()
  @IsNotEmpty()
  nomineeCode: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  voteQuantity: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class FinalizePaymentDto {
  @IsString()
  @IsNotEmpty()
  nomineeCode: string;

  @IsString()
  @IsNotEmpty()
  reference: string;
}

export class CreateRecipientDto {
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  network: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  adminEmail: string;
}

export class InitializeTransferDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  adminEmail: string;
}
