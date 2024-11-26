import {
  ConflictException,
  // ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NominationsDto,
  NomineesDto,
  UserOnboardDto,
} from 'src/dto/user.dto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { generateId } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  logger = new Logger(UserService.name);
  uniqueGeneratedId = generateId();

  async onboardUser(email: string, payload: UserOnboardDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //throw an error when the user is not found
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //throw an error when the user is already onboarded
    if (user.isOnboarded === true) {
      return {
        redirectUrl: this.config.get('CLIENT_ADMIN_DASHBOARD'),
      };
    }

    //update the user details with the data
    try {
      const userOnboard = await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          isOnboarded: true,
          organizations: {
            create: {
              organizationName: payload.organizationName,
              phone: payload.phone,
              otherPhone: payload.otherPhone,
              address: payload.address,
              profileImage: payload.profileImage,
            },
          },
        },
        include: {
          organizations: true,
        },
      });

      //return the user  to the client
      return {
        user: userOnboard,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'An error occurred while creating user',
        );
      }

      //else
      this.logger.error(error);
    }
  }

  //nominate method
  async nominateUser(adminEmail: string, payload: NomineesDto) {
    //fetch the host listing the nomination
    const admin = await this.prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    const nomineeExists = await this.prisma.nominees.findFirst({
      where: {
        nomineeEmail: payload.nomineeEmail,
      },
    });

    //throw an error when the nominee has been nominated already
    if (nomineeExists) {
      throw new ConflictException('Nominee already exists.');
    }

    //throw an error when the host is not permitted or authorized
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    //check user role and permissions
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied for this process.');
    }

    //update the nominations model
    const nominateNominee = await this.prisma.nominations.update({
      where: {
        uniqueNominationId: payload.uniqueNominationId,
      },
      data: {
        nominees: {
          create: {
            nomineeBio: payload.nomineeBio,
            nomineeFirstName: payload.nomineeFirstName,
            nomineeLastName: payload.nomineeLastName,
            nomineeEmail: payload.nomineeEmail,
            nomineeCode: this.uniqueGeneratedId,
            nomineeProfileImage: payload.nomineeProfileImage,
            nomineePhone: payload.nomineePhone,
            nomineeCategory: payload.nomineeCategory,
          },
        },
      },
    });

    //return the added nominee
    return {
      message: 'Nominee added successfully',
      nominee: nominateNominee,
      success: true,
    };
  }

  //nominate method
  async addNomination(adminEmail: string, payload: NominationsDto) {
    //fetch the host listing the nomination
    const admin = await this.prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    const nominationExist = await this.prisma.nominations.findUnique({
      where: {
        uniqueNominationId: payload.nominationId,
      },
    });

    //throw an error when the nominee has been nominated already
    if (nominationExist) {
      throw new ConflictException('Nomination already created.');
    }

    //throw an error when the host is not permitted or authorized
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    //check user role and permissions
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied for this process.');
    }

    //update the nominations model
    const createNomination = await this.prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        nominations: {
          create: {
            nominationCategory: payload.nominationCategory,
            nominationPeriod: payload.nominationDuration,
            uniqueNominationId: this.uniqueGeneratedId,
            nominationStartDate: payload.nominationStartDate,
            nominationEndDate: payload.nominationEndDate,
          },
        },
      },
    });

    //return the added nominee
    return {
      message: 'Nomination added successfully',
      nomination: createNomination,
      success: true,
    };
  }
}
