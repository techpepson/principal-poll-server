import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserOnboardDto {
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  otherPhone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  profileImage: string;
}

export class NomineesDto {
  @IsString()
  @IsNotEmpty()
  nomineeName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  nomineePhone: string;

  @IsString()
  @IsNotEmpty()
  nomineeFirstName: string;

  @IsString()
  @IsNotEmpty()
  nomineeLastName: string;

  @IsString()
  @IsNotEmpty()
  nomineeEmail: string;

  @IsString()
  @IsNotEmpty()
  nomineeProfileImage: string;

  @IsString()
  @IsNotEmpty()
  nomineeCategory: string;

  @IsString()
  @IsNotEmpty()
  nomineeBio: string;
}

export class NominationsDto {
  @IsString()
  nominationsTitle: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsArray()
  nominationCategories: string[];

  @IsString()
  nominationPeriod: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Value must be a valid float' },
  )
  @Transform(({ value }) => Number(value))
  nominationRate: number;

  @IsString()
  nominationDescription: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  nominationStartDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  nominationEndDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  nomineePhone: string;

  @IsString()
  @IsNotEmpty()
  nomineeFirstName: string;

  @IsString()
  @IsNotEmpty()
  nomineeLastName: string;

  @IsString()
  @IsNotEmpty()
  nomineeEmail: string;

  @IsString()
  @IsNotEmpty()
  nomineeProfileImage: string;

  @IsString()
  @IsNotEmpty()
  nomineeCategory: string;

  @IsString()
  @IsNotEmpty()
  nomineeBio: string;
}
