import { IsDate, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  uniqueNominationId: string;
}

export class NominationsDto {
  @IsString()
  @IsNotEmpty()
  nominationName: string;

  @IsString()
  @IsNotEmpty()
  nominationCategory: string;

  @IsString()
  nominationDuration: string;

  @IsDate()
  @IsNotEmpty()
  nominationStartDate: Date;

  @IsDate()
  @IsNotEmpty()
  nominationEndDate: Date;

  @IsString()
  nominationId: string;
}
