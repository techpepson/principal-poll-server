import {
  ConflictException,
  // ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NominationsDto, UserOnboardDto } from 'src/dto/user.dto.service';
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

  //nominate nominee method
  async nominateUser(adminEmail: string, payload: NominationsDto) {
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
    if (
      nomineeExists &&
      nomineeExists.nomineeCategory.includes(payload.nomineeCategory)
    ) {
      throw new ConflictException('Nominee already created in this category.');
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
    try {
      const nominateNominee = await this.prisma.user.update({
        where: {
          email: adminEmail,
        },
        data: {
          nominations: {
            create: {
              nominationCategories: payload.nominationCategories.map(
                (category) => category,
              ),
              nominationStartDate: new Date(payload.nominationStartDate),
              nominationEndDate: new Date(payload.nominationEndDate),
              nominationPeriod: payload.nominationPeriod,
              nominationDescription: payload.nominationDescription,
              uniqueNominationId: generateId(),
              nominationTitle: payload.nominationsTitle,
              nominationRate: payload.nominationRate,
              nominees: {
                create: {
                  nomineePhone: payload.nomineePhone,
                  nomineeFirstName: payload.nomineeFirstName,
                  nomineeLastName: payload.nomineeLastName,
                  nomineeEmail: payload.nomineeEmail,
                  nomineeProfileImage: payload.nomineeProfileImage,
                  nomineeBio: payload.nomineeBio,
                  nomineeCode: generateId(),
                  nomineeCategory: payload.nomineeCategory,
                },
              },
            },
          },
        },
        include: {
          nominations: {
            include: {
              nominees: true,
            },
          },
        },
      });

      // Return the added nominee
      return {
        message: 'Nominee added successfully',
        nominee: nominateNominee,
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        // this.logger.error(`Error: ${error.message}`, error.stack);
        console.log(error);
        throw new InternalServerErrorException('Nominee addition failed');
      }
      this.logger.error('An unknown error occurred:', error);
    }
  }

  async approveNominee(adminEmail: string, nomineeCode: string) {
    //check the admin performing operation
    const admin = await this.prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    //throw an error when the admin is not permitted from carrying out the operation
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    //get the nominee from the database
    const nominee = await this.prisma.nominees.findFirst({
      where: {
        nomineeCode: nomineeCode,
      },
    });

    //throw an error when the user is not in the system
    if (!nominee) {
      throw new NotFoundException('Nominee not found.');
    }

    //check if the nominee has been approved already
    if (nominee.nomineeStatus === 'approved') {
      throw new ConflictException('The nominee has been approved already.');
    }
    //update the nominee status
    try {
      const updatedNominee = await this.prisma.nominees.update({
        where: {
          nomineeCode,
        },
        data: {
          nomineeStatus: 'approved',
        },
      });

      return {
        message: 'Nominee Approved successfully',
        nominee: updatedNominee, // Return the updated nominee
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `An error occurred while approving user, ${error.stack}`,
        );
        throw new InternalServerErrorException(
          'An error occurred while approving nominee',
        );
      }
      this.logger.error(error);
    }
  }

  //remove nominee
  async removeNominee(adminEmail: string, nomineeCode: string) {
    //check the admin performing operation
    const admin = await this.prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    //throw an error when the admin is not permitted from carrying out the operation
    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    //get the nominee from the database
    const nominee = await this.prisma.nominees.findFirst({
      where: {
        nomineeCode,
      },
    });

    //throw an error when the user is not in the system
    if (!nominee) {
      throw new NotFoundException('Nominee not found.');
    }

    try {
      //delete nominations
      await this.prisma.nominations.deleteMany({
        where: {
          nominees: {
            some: {
              nomineeCode,
            },
          },
        },
      });

      await this.prisma.nominees.delete({
        where: {
          nomineeCode,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'An error occurred while removing nominee',
        );
      }
      this.logger.error(error);
    }

    return {
      message: 'Nominee removed successfully',
    };
  }

  //method to delete account
  async deleteAccount(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //send an error when account cannot be deleted
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.user.delete({
        where: {
          email,
        },
      });

      //return a message to the service
      return {
        message: 'Account deleted successfully.',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('Error deleting account');
      }
      return error;
    }
  }

  //edit account

  async editAccount(email: string, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //check if the user exists

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //check if payload includes restricted editing values
    if (
      Object.keys(payload).includes('role') ||
      Object.keys(payload).includes('isOnboarded')
    ) {
      throw new UnauthorizedException('Such edits are not allowed.');
    }
    //update the database with whatever is provided by user
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        ...payload,
      },
    });

    //return the edited user to the client
    return {
      message: 'Account edited successfully',
    };
  }

  //get all contestants from the database
  async readAllNominations(takeValue: number, email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //check if the use is in the database
    if (!user) {
      throw new NotFoundException('The admin could not be found');
    }

    //check if the user is allowed to fetch the contestants
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    //fetch the nominations from the database

    try {
      const nominations = await this.prisma.user.findMany({
        take: takeValue,
        where: {
          email,
        },
        include: {
          nominations: {
            orderBy: {
              nominationTitle: 'asc',
            },
            include: {
              nominees: {
                orderBy: {
                  nomineeFirstName: 'asc',
                },
              },
            },
          },
        },
      });

      // Return the nominations with a success message
      return {
        message: 'Nominations returned successfully.',
        nominations,
        length: nominations.length,
      };
    } catch (error) {
      // Log the error for debugging (optional)
      console.error(error);

      // Throw an internal server error
      throw new InternalServerErrorException(
        'There was an internal server error while fetching nominations',
      );
    }
  }

  //fetch nomination nominees
  async readAllNominationNominees(nominationId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //check if the use is in the database
    if (!user) {
      throw new NotFoundException('The admin could not be found');
    }

    //check if the user is allowed to fetch the contestants
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied');
    }

    //fetch the nominations from the database

    try {
      const nominationNominees = await this.prisma.nominations.findMany({
        where: {
          uniqueNominationId: nominationId,
        },
        include: {
          nominees: {
            orderBy: {
              nomineeFirstName: 'asc',
            },
          },
        },
      });

      // Return the nominations with a success message
      return {
        message: 'Nominees returned successfully.',
        nominationNominees,
      };
    } catch (error) {
      // Log the error for debugging (optional)
      console.error(error);

      // Throw an internal server error
      throw new InternalServerErrorException(
        'There was an internal server error while fetching nominees',
      );
    }
  }
}
