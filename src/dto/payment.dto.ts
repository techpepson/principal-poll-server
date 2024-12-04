import { IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  email: string;

  @IsNumber()
  amount: number;
}
