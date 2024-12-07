import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from 'src/dto';
import * as argon from 'argon2';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);
  async createUser(authDto: RegisterDto): Promise<any> {
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash the user's password
    let hashedPass: string;
    try {
      hashedPass = await argon.hash(authDto.password);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException('Password Hashing failed.');
      }
    }

    // Create the new user in the database
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: authDto.email,
          pass: hashedPass,
          name: authDto.name,
        },
        select: {
          email: true,
          name: true,
        },
      });

      // Return the created user
      return {
        user: newUser,
        message: 'Registration successful',
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error creating user');
      }
      throw new InternalServerErrorException('Error creating user.');
    }
  }

  async loginUser(loginDto: LoginDto) {
    //fetch existing users from the system
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    //does user exist?
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //unhash user password
    const isPasswordMatch = await argon.verify(user.pass, loginDto.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password mismatch detected');
    }

    try {
      // jwt payload
      const payload = {
        sub: user.userId,
        userEmail: user.email,
      };

      //sign token
      const token = this.jwt.sign(payload);

      //user details
      const userResponsePayload = {
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
      };

      return {
        message: 'Login successful',
        token: token,
        user: userResponsePayload,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn('Token generation error');
      }
      throw new BadGatewayException('Token generation failed');
    }
  }
}
